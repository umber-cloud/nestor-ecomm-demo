"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, CameraOff, Glasses, ScanFace } from "lucide-react";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm";
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// Material names in the source GLB that represent the frame (vs. lenses/nose
// pad, which should stay untinted).
const FRAME_MATERIAL_NAMES = new Set(["frame", "arm"]);

// ---------------------------------------------------------------------------
// Fit model
//
// The glasses are posed directly from the 478 face landmarks, in the video's
// own pixel space, and drawn with an orthographic camera that maps 1 unit to
// 1 video pixel. Nothing depends on a guessed camera field of view or on
// constants tuned for one particular GLB, so the overlay stays registered to
// the face wherever it is in the frame and however far away it is.
//
// Only rigid landmarks are used (eye corners, nasion, forehead, nose base), so
// blinking, looking around, talking and smiling do not move the glasses.
// ---------------------------------------------------------------------------
const LM = {
  rightEyeOuter: 33, // subject's right eye = left side of the unmirrored image
  leftEyeOuter: 263,
  rightTemple: 127,
  leftTemple: 356,
  nasion: 168, // top of the nose bridge, between the eyes
  foreheadTop: 10,
  noseBase: 2,
};

// Frame width as a multiple of the outer-eye-corner distance. An adult's
// outer-corner distance is ~8.9cm and a typical frame is ~14cm wide.
const FRAME_WIDTH_PER_EYE_SPAN = 1.56;
// The forehead-top -> nose-base line leans back from the face's true vertical
// by this much in MediaPipe's canonical face (atan2(1.577, 10.351)); undo it
// so the lenses sit upright on the face instead of tipping forward.
const FACE_VERTICAL_LEAN_RAD = 0.1512;
// Offsets of the frame from the eye line / nose bridge, in eye-span units.
const FRAME_DROP = 0.035; // lens centres sit slightly below the pupils
const FRAME_STANDOFF = 0.03; // frame rests just proud of the nose bridge

// Hide the glasses if the face has been lost for this long.
const LOST_FACE_TIMEOUT_MS = 250;

/**
 * One Euro filter: heavy smoothing while the signal is still (kills landmark
 * jitter), almost none while it moves fast (no lag when the head moves).
 */
class OneEuro {
  constructor(minCutoff, beta) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.x = null;
    this.dx = 0;
  }
  static alpha(cutoff, dt) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
  reset() {
    this.x = null;
    this.dx = 0;
  }
  filter(value, dt) {
    if (this.x === null) {
      this.x = value;
      return value;
    }
    const dx = (value - this.x) / dt;
    this.dx += (dx - this.dx) * OneEuro.alpha(1, dt);
    const cutoff = this.minCutoff + this.beta * Math.abs(this.dx);
    this.x += (value - this.x) * OneEuro.alpha(cutoff, dt);
    return this.x;
  }
}

/**
 * Normalises an arbitrary glasses GLB so the tracker can treat it uniformly:
 * makes the lenses face +Z, and moves the centre of the front frame to the
 * origin. Returns the width of the front frame in model units.
 */
function normaliseGlassesModel(THREE, model) {
  const collect = () => {
    const points = [];
    const v = new THREE.Vector3();
    model.updateMatrixWorld(true);
    model.traverse((child) => {
      const position = child.isMesh && child.geometry?.attributes?.position;
      if (!position) return;
      for (let i = 0; i < position.count; i++) {
        v.fromBufferAttribute(position, i).applyMatrix4(child.matrixWorld);
        points.push(v.clone());
      }
    });
    return points;
  };

  let points = collect();
  if (points.length === 0) return 1;
  let box = new THREE.Box3().setFromPoints(points);
  let size = box.getSize(new THREE.Vector3());
  let centre = box.getCenter(new THREE.Vector3());
  const slab = Math.max(size.z * 0.15, 1e-6);

  // The front of the frame has geometry across its whole width (bridge,
  // lenses); the back is just two temple tips out at the sides.
  const isCentral = (p) => Math.abs(p.x - centre.x) < size.x * 0.25;
  const nearMax = points.filter((p) => p.z > box.max.z - slab && isCentral(p)).length;
  const nearMin = points.filter((p) => p.z < box.min.z + slab && isCentral(p)).length;
  if (nearMin > nearMax) {
    model.rotation.y += Math.PI;
    points = collect();
    box = new THREE.Box3().setFromPoints(points);
    size = box.getSize(new THREE.Vector3());
    centre = box.getCenter(new THREE.Vector3());
  }

  const front = new THREE.Box3().setFromPoints(points.filter((p) => p.z > box.max.z - slab));
  const pivot = front.getCenter(new THREE.Vector3());
  model.position.sub(pivot);
  return front.max.x - front.min.x || size.x || 1;
}

/** Camera-based virtual try-on: tracks the viewer's face and overlays a 3D glasses model. */
function TryItOnModal({ open, onOpenChange, modelUrl, frameColor }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | denied | error
  const [faceFound, setFaceFound] = useState(true);

  useEffect(() => {
    if (!open || !modelUrl) return;

    let cancelled = false;
    let stream = null;
    let faceLandmarker = null;
    let renderer = null;
    let environment = null;
    let rafId = null;
    let onVideoResize = null;

    // MediaPipe's WASM runtime prints harmless status lines such as
    // "INFO: Created TensorFlow Lite XNNPACK delegate for CPU." through
    // console.error, which the Next.js dev overlay reports as an error.
    // Drop those while the try-on is running; real errors still get through.
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && /^(INFO|W\d{4}|I\d{4})[: ]/.test(args[0])) return;
      originalConsoleError.apply(console, args);
    };

    async function createLandmarker(FaceLandmarker, fileset, delegate) {
      return FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate },
        runningMode: "VIDEO",
        numFaces: 1,
        // Slightly below the 0.5 defaults so tracking survives turned heads,
        // dim rooms and partial occlusion instead of dropping out.
        minFaceDetectionConfidence: 0.4,
        minFacePresenceConfidence: 0.4,
        minTrackingConfidence: 0.4,
      });
    }

    async function start() {
      setStatus("loading");
      setFaceFound(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const [{ FaceLandmarker, FilesetResolver }, THREE, { GLTFLoader }, { RoomEnvironment }] =
          await Promise.all([
            import("@mediapipe/tasks-vision"),
            import("three"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
          ]);
        if (cancelled) return;

        const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
        try {
          faceLandmarker = await createLandmarker(FaceLandmarker, fileset, "GPU");
        } catch (gpuError) {
          console.warn("[TryItOn] GPU delegate unavailable, using CPU:", gpuError);
          faceLandmarker = await createLandmarker(FaceLandmarker, fileset, "CPU");
        }
        if (cancelled) {
          faceLandmarker.close();
          return;
        }

        const canvas = canvasRef.current;
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();
        scene.environment = environment;
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(0, 1, 2);
        scene.add(keyLight);

        // 1 world unit == 1 video pixel, origin at the centre of the frame.
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 6000);
        camera.position.z = 3000;

        // Posed at the frame anchor, scaled so 1 local unit == frame width.
        const headGroup = new THREE.Group();
        headGroup.visible = false;
        scene.add(headGroup);

        // Invisible stand-in for the head: writes depth only, so the temple
        // arm on the far side disappears behind the head when it turns.
        const occluder = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 24),
          new THREE.MeshBasicMaterial({ colorWrite: false })
        );
        occluder.scale.set(0.455, 0.7, 0.55);
        occluder.position.set(0, -0.1, -0.62);
        occluder.renderOrder = -1;
        headGroup.add(occluder);

        new GLTFLoader().load(
          modelUrl,
          (gltf) => {
            if (cancelled) return;
            const model = gltf.scene;
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
            const frontWidth = normaliseGlassesModel(THREE, model);
            const fit = new THREE.Group();
            fit.scale.setScalar(1 / frontWidth);
            fit.add(model);
            headGroup.add(fit);
          },
          undefined,
          (err) => console.error("[TryItOn] failed to load glasses model:", err)
        );

        let videoW = 0;
        let videoH = 0;
        const resize = () => {
          videoW = video.videoWidth || 640;
          videoH = video.videoHeight || 480;
          renderer.setSize(videoW, videoH, false);
          camera.left = -videoW / 2;
          camera.right = videoW / 2;
          camera.top = videoH / 2;
          camera.bottom = -videoH / 2;
          camera.updateProjectionMatrix();
        };
        resize();
        onVideoResize = resize; // phone rotation changes the stream's size
        video.addEventListener("resize", onVideoResize);

        // Scratch objects (no per-frame allocation).
        const p = {};
        Object.keys(LM).forEach((k) => (p[k] = new THREE.Vector3()));
        const xAxis = new THREE.Vector3();
        const yAxis = new THREE.Vector3();
        const zAxis = new THREE.Vector3();
        const up = new THREE.Vector3();
        const tmp = new THREE.Vector3();
        const eyeMid = new THREE.Vector3();
        const anchor = new THREE.Vector3();
        const basis = new THREE.Matrix4();
        const rawQuat = new THREE.Quaternion();

        const posFilter = [new OneEuro(2, 0.03), new OneEuro(2, 0.03), new OneEuro(2, 0.03)];
        const widthFilter = new OneEuro(1, 0.01);
        let tracking = false;
        let lastSeenAt = 0;
        let lastVideoTime = -1;
        let lastDetectAt = 0;
        let lastFaceFound = true;

        const reportFace = (found) => {
          if (found === lastFaceFound) return;
          lastFaceFound = found;
          setFaceFound(found);
        };

        const applyPose = (landmarks, dt) => {
          // Landmarks -> pixel space, y up, +z toward the camera. MediaPipe's
          // z is relative depth on the same scale as x, closer = smaller.
          for (const key in LM) {
            const lm = landmarks[LM[key]];
            p[key].set((lm.x - 0.5) * videoW, (0.5 - lm.y) * videoH, -lm.z * videoW);
          }

          // Head axes. x: across the face (averaged over two rigid pairs).
          xAxis.subVectors(p.leftEyeOuter, p.rightEyeOuter).normalize();
          tmp.subVectors(p.leftTemple, p.rightTemple).normalize();
          xAxis.add(tmp).normalize();
          up.subVectors(p.foreheadTop, p.noseBase).normalize();
          zAxis.crossVectors(xAxis, up).normalize();
          yAxis.crossVectors(zAxis, xAxis).normalize();
          // Undo the built-in backward lean of the forehead->nose-base line.
          const c = Math.cos(FACE_VERTICAL_LEAN_RAD);
          const s = Math.sin(FACE_VERTICAL_LEAN_RAD);
          tmp.copy(yAxis);
          yAxis.multiplyScalar(c).addScaledVector(zAxis, s);
          zAxis.multiplyScalar(c).addScaledVector(tmp, -s);
          basis.makeBasis(xAxis, yAxis, zAxis);
          rawQuat.setFromRotationMatrix(basis);

          const eyeSpan = p.leftEyeOuter.distanceTo(p.rightEyeOuter);
          if (!(eyeSpan > 1)) return false;

          // Anchor: centred between the eyes, at the depth of the nose bridge.
          eyeMid.addVectors(p.leftEyeOuter, p.rightEyeOuter).multiplyScalar(0.5);
          const bridgeDepth = tmp.subVectors(p.nasion, eyeMid).dot(zAxis);
          anchor
            .copy(eyeMid)
            .addScaledVector(zAxis, bridgeDepth + FRAME_STANDOFF * eyeSpan)
            .addScaledVector(yAxis, -FRAME_DROP * eyeSpan);
          const frameWidth = eyeSpan * FRAME_WIDTH_PER_EYE_SPAN;

          if (!tracking) {
            // Snap on (re)acquisition so the glasses don't swoop in.
            posFilter.forEach((f) => f.reset());
            widthFilter.reset();
            headGroup.quaternion.copy(rawQuat);
            tracking = true;
          } else {
            // Rotation: smooth small jitter hard, follow real turns quickly.
            const angle = headGroup.quaternion.angleTo(rawQuat);
            const rate = 12 + 250 * angle;
            headGroup.quaternion.slerp(rawQuat, 1 - Math.exp(-dt * rate));
          }
          headGroup.position.set(
            posFilter[0].filter(anchor.x, dt),
            posFilter[1].filter(anchor.y, dt),
            posFilter[2].filter(anchor.z, dt)
          );
          headGroup.scale.setScalar(widthFilter.filter(frameWidth, dt));
          return true;
        };

        const loop = () => {
          if (cancelled) return;
          const now = performance.now();
          // Only run detection when the camera has produced a new frame.
          if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            const dt = Math.min(0.1, Math.max(0.001, (now - lastDetectAt) / 1000));
            lastDetectAt = now;
            const results = faceLandmarker.detectForVideo(video, now);
            const landmarks = results.faceLandmarks?.[0];
            if (landmarks && landmarks.length > LM.leftTemple && applyPose(landmarks, dt)) {
              lastSeenAt = now;
              headGroup.visible = true;
              reportFace(true);
            } else if (now - lastSeenAt > LOST_FACE_TIMEOUT_MS) {
              tracking = false;
              headGroup.visible = false;
              reportFace(false);
            }
            renderer.render(scene, camera);
          }
          rafId = requestAnimationFrame(loop);
        };
        lastSeenAt = performance.now();
        rafId = requestAnimationFrame(loop);

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("[TryItOn] failed to start camera/tracking:", err);
        setStatus(err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError" ? "denied" : "error");
      }
    }

    const video = videoRef.current;
    start();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (video && onVideoResize) video.removeEventListener("resize", onVideoResize);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (faceLandmarker) faceLandmarker.close();
      if (environment) environment.dispose();
      if (renderer) renderer.dispose();
      console.error = originalConsoleError;
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
          {/* Video and canvas share the same intrinsic size and the same
              object-fit, so the overlay stays pixel-aligned with the camera
              image whatever aspect ratio the camera delivers. */}
          <div className="absolute inset-0" style={{ transform: "scaleX(-1)" }}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {status === "ready" && !faceFound && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-background/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <ScanFace className="h-4 w-4 text-primary" />
              Looking for your face — move into the frame
            </div>
          )}
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
      </DialogContent>
    </Dialog>
  );
}

export default TryItOnModal;
