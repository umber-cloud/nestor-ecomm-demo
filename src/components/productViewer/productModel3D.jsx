"use client";
import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

/**
 * Renders a GLB/GLTF/USDZ product asset via Google's <model-viewer> web
 * component. The library registers a custom element on `window`, so it's
 * only safe to load client-side — imported dynamically in an effect rather
 * than at module scope, which would break server rendering.
 */
function ProductModel3D({ url }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Loading 3D viewer…
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <model-viewer
        src={url}
        camera-controls
        auto-rotate
        auto-rotate-delay="1200"
        shadow-intensity="1"
        exposure="1"
        interaction-prompt="none"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-background/80 border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary pointer-events-none">
        <RotateCw className="h-3 w-3" />
        Drag to rotate
      </div>
    </div>
  );
}

export default ProductModel3D;
