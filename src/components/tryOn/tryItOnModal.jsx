"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, CameraOff, Glasses } from "lucide-react";

// Starting-point placement constants for the glasses GLB relative to the
// MediaPipe facial transformation matrix (which is in real-world-ish cm,
// origin roughly between the eyes). Source models vary in scale/orientation,
// so these are tuned by eye against a live camera feed, not computed —
// adjust them here if the glasses sit too big/small or offset on a real face.
const GLASSES_SCALE = 0.0594;
const GLASSES_OFFSET = [-0.05, -0.019, 0.014];
const GLASSES_ROTATION = [0, 3.0216 - Math.PI, 0];

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm";
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// Material names in the source GLB that represent the frame (vs. lenses/nose
// pad, which should stay untinted) — see public material inspection notes.
const FRAME_MATERIAL_NAMES = new Set(["frame", "arm"]);

// Vertical FOV assumed by both the MediaPipe facial transformation matrix's
// metric space and our PerspectiveCamera below -- must match the `camera`
// construction further down. Used to re-derive a metric inter-pupillary
// distance from the 2D iris landmarks + the matrix's metric head depth, so
// glasses scale to the real detected face instead of one guessed constant
// (the same anchoring technique commercial try-on, e.g. MediaPipe's own
// glasses-fitting writeup, uses iris size/position for).
const CAMERA_VERTICAL_FOV_DEG = 63;
const AVERAGE_ADULT_IPD_CM = 6.3;
// MediaPipe FaceLandmarker's 478-point mesh: 468 = right-eye iris center,
// 473 = left-eye iris center (ring points around each are 469-472 / 474-477).
const LEFT_IRIS_CENTER = 473;
const RIGHT_IRIS_CENTER = 468;

/** Camera-based virtual try-on: tracks the viewer's face and overlays a 3D glasses model. */
const DEFAULT_ADJUST = { scaleMult: 1, ox: 0, oy: 0, oz: 0, rx: 0, ry: 0, rz: 0 };

function TryItOnModal({ open, onOpenChange, modelUrl, frameColor }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const adjustRef = useRef({ ...DEFAULT_ADJUST });
  const [status, setStatus] = useState("idle"); // idle | loading | ready | denied | error
  const [adjust, setAdjust] = useState({ ...DEFAULT_ADJUST });

  const updateAdjust = (key, value) => {
    adjustRef.current = { ...adjustRef.current, [key]: value };
    setAdjust(adjustRef.current);
  };

  useEffect(() => {
    if (!open || !modelUrl) return;

    let cancelled = false;
    let stream = null;
    let faceLandmarker = null;
    let renderer = null;
    let rafId = null;

    async function start() {
      setStatus("loading");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const [{ FaceLandmarker, FilesetResolver }, THREE, { GLTFLoader }] = await Promise.all([
          import("@mediapipe/tasks-vision"),
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
        ]);
        if (cancelled) return;

        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE);
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: "GPU" },
          outputFacialTransformationMatrixes: true,
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (cancelled) {
          faceLandmarker.close();
          return;
        }

        const canvas = canvasRef.current;
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(0, 1, 1);
        scene.add(dirLight);

        const camera = new THREE.PerspectiveCamera(CAMERA_VERTICAL_FOV_DEG, 1, 0.01, 5000);
        const focalLengthPx = () =>
          (video.videoHeight || 480) / 2 / Math.tan((CAMERA_VERTICAL_FOV_DEG * Math.PI) / 180 / 2);

        const glassesGroup = new THREE.Group();
        glassesGroup.visible = false;
        scene.add(glassesGroup);

        // Per-frame head pose is noisy (landmark jitter), so smooth toward it
        // instead of snapping, which is what makes commercial try-on feel
        // "locked on" rather than swimming. Rotation uses slerp since lerping
        // quaternion components directly isn't a valid rotation interpolation.
        const SMOOTHING = 0.35; // lower = smoother/laggier, higher = snappier/jitterier
        const rawMatrix = new THREE.Matrix4();
        const rawPos = new THREE.Vector3();
        const rawQuat = new THREE.Quaternion();
        const rawScale = new THREE.Vector3();
        const smoothedPos = new THREE.Vector3();
        const smoothedQuat = new THREE.Quaternion();
        let hasTrackedOnce = false;
        let smoothedIpdScaleFactor = 1;
        let hasIpdOnce = false;

        new GLTFLoader().load(modelUrl, (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;
          if (frameColor) {
            const tint = new THREE.Color(frameColor);
            model.traverse((child) => {
              if (!child.isMesh || !child.material) return;
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (FRAME_MATERIAL_NAMES.has(mat.name)) mat.color.copy(tint);
              });
            });
          }
          glassesGroup.add(model);
        });

        const resize = () => {
          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();

        const loop = () => {
          if (cancelled) return;
          if (video.readyState >= 2) {
            const results = faceLandmarker.detectForVideo(video, performance.now());
            const matrixData = results.facialTransformationMatrixes?.[0]?.data;
            glassesGroup.visible = Boolean(matrixData) || hasTrackedOnce;
            if (matrixData) {
              rawMatrix.fromArray(matrixData);
              rawMatrix.decompose(rawPos, rawQuat, rawScale);
              if (!hasTrackedOnce) {
                // Snap on the very first detection so the glasses don't
                // swoop in from the scene origin.
                smoothedPos.copy(rawPos);
                smoothedQuat.copy(rawQuat);
                hasTrackedOnce = true;
              } else {
                smoothedPos.lerp(rawPos, SMOOTHING);
                smoothedQuat.slerp(rawQuat, SMOOTHING);
              }
              glassesGroup.position.copy(smoothedPos);
              glassesGroup.quaternion.copy(smoothedQuat);

              // Re-derive a metric inter-pupillary distance from the 2D iris
              // landmarks + this frame's metric head depth (rawPos.z), then
              // scale the glasses relative to the population-average adult
              // IPD. This is what makes the fit track an individual face's
              // real size/distance instead of one fixed guessed scale.
              const landmarks = results.faceLandmarks?.[0];
              const leftIris = landmarks?.[LEFT_IRIS_CENTER];
              const rightIris = landmarks?.[RIGHT_IRIS_CENTER];
              if (leftIris && rightIris) {
                const w = video.videoWidth || 640;
                const h = video.videoHeight || 480;
                const dx = (leftIris.x - rightIris.x) * w;
                const dy = (leftIris.y - rightIris.y) * h;
                const ipdPx = Math.hypot(dx, dy);
                const depth = Math.abs(rawPos.z) || 40;
                const ipdMetric = (ipdPx / focalLengthPx()) * depth;
                const rawScaleFactor = Math.min(
                  1.8,
                  Math.max(0.6, ipdMetric / AVERAGE_ADULT_IPD_CM)
                );
                if (!hasIpdOnce) {
                  smoothedIpdScaleFactor = rawScaleFactor;
                  hasIpdOnce = true;
                } else {
                  smoothedIpdScaleFactor +=
                    (rawScaleFactor - smoothedIpdScaleFactor) * SMOOTHING;
                }
              }
            }
            if (modelRef.current) {
              const a = adjustRef.current;
              modelRef.current.scale.setScalar(
                GLASSES_SCALE * a.scaleMult * smoothedIpdScaleFactor
              );
              modelRef.current.position.set(
                GLASSES_OFFSET[0] + a.ox,
                GLASSES_OFFSET[1] + a.oy,
                GLASSES_OFFSET[2] + a.oz
              );
              modelRef.current.rotation.set(
                GLASSES_ROTATION[0] + a.rx,
                GLASSES_ROTATION[1] + a.ry,
                GLASSES_ROTATION[2] + a.rz
              );
            }
            renderer.render(scene, camera);
          }
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("[TryItOn] failed to start camera/tracking:", err);
        setStatus(err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError" ? "denied" : "error");
      }
    }

    start();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (faceLandmarker) faceLandmarker.close();
      if (renderer) renderer.dispose();
      modelRef.current = null;
      adjustRef.current = { ...DEFAULT_ADJUST };
      setAdjust({ ...DEFAULT_ADJUST });
      setStatus("idle");
    };
  }, [open, modelUrl, frameColor]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest">
            <Glasses className="h-4 w-4 text-primary" />
            Try it on yourself
          </DialogTitle>
          <DialogDescription>
            Uses your camera locally in the browser — nothing is recorded or uploaded.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
          <div className="absolute inset-0" style={{ transform: "scaleX(-1)" }}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>

          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Starting camera…
            </div>
          )}
          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90 px-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <CameraOff className="h-6 w-6 text-destructive" />
              Camera access denied — allow camera permissions to try this on.
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90 px-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <CameraOff className="h-6 w-6 text-destructive" />
              Couldn&apos;t start the try-on experience. Check your camera and try again.
            </div>
          )}
        </div>

        {status === "ready" && (
          <div className="mt-2 space-y-2 border border-dashed border-border p-3 font-mono text-[11px]">
            <p className="uppercase tracking-widest text-muted-foreground">
              Calibration (temporary — tune until the glasses sit right, then send me these numbers)
            </p>
            {[
              { key: "scaleMult", label: "Scale ×", min: 0.1, max: 3, step: 0.01 },
              { key: "ox", label: "Offset X", min: -0.15, max: 0.15, step: 0.001 },
              { key: "oy", label: "Offset Y", min: -0.15, max: 0.15, step: 0.001 },
              { key: "oz", label: "Offset Z", min: -0.15, max: 0.15, step: 0.001 },
              { key: "rx", label: "Rotate X", min: -3.2, max: 3.2, step: 0.01 },
              { key: "ry", label: "Rotate Y", min: -3.2, max: 3.2, step: 0.01 },
              { key: "rz", label: "Rotate Z", min: -3.2, max: 3.2, step: 0.01 },
            ].map(({ key, label, min, max, step }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={adjust[key]}
                  onChange={(e) => updateAdjust(key, parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 shrink-0 text-right">{adjust[key].toFixed(3)}</span>
              </div>
            ))}
            <p className="text-muted-foreground">
              scale={(GLASSES_SCALE * adjust.scaleMult).toFixed(4)}, offset=[
              {(GLASSES_OFFSET[0] + adjust.ox).toFixed(4)},{" "}
              {(GLASSES_OFFSET[1] + adjust.oy).toFixed(4)},{" "}
              {(GLASSES_OFFSET[2] + adjust.oz).toFixed(4)}], rotation=[
              {(GLASSES_ROTATION[0] + adjust.rx).toFixed(4)},{" "}
              {(GLASSES_ROTATION[1] + adjust.ry).toFixed(4)},{" "}
              {(GLASSES_ROTATION[2] + adjust.rz).toFixed(4)}]
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TryItOnModal;
