import React, { useEffect, useRef, useState } from "react";
import { Root } from "../lib/Root";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";

export default function ThreeRoot(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [initError, setInitError] = useState<Error | null>(null);
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);

  useEffect(() => {
    let scene: Root | null = null;
    let cancelled = false;

    const setup = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          console.warn("ThreeRoot: canvas not found, aborting init");
          return;
        }

        // Keep canvas visually behind UI and non-blocking for pointer events
        Object.assign(canvas.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "0",
          pointerEvents: "none",
        } as Partial<CSSStyleDeclaration>);

        let available = false;
        try {
          if (typeof WebGPU?.isAvailable !== "function") {
            available = false;
          } else {
            available = await (WebGPU.isAvailable() as Promise<boolean> | boolean);
          }
        } catch (e) {
          console.warn("ThreeRoot: WebGPU availability check failed", e);
          available = false;
        }

        if (cancelled) return;
        setHasWebGPU(available);

        if (!available) {
          const err = new Error("WebGPU not available on this platform/browser");
          setInitError(err);
          console.warn("ThreeRoot: WebGPU not available. Falling back to gradient.");
          return;
        }

        scene = new Root(canvas);
        rootRef.current = scene;   // <-- save reference
        await scene.init();

        // --- FIX: resize handler that updates renderer and camera ---
        const handleResize = () => {
          if (!rootRef.current) return;
          const width = window.innerWidth;
          const height = window.innerHeight;

          // Update canvas element size (already done in the other effect, but safe)
          if (canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            canvasRef.current.style.width = `${width}px`;
            canvasRef.current.style.height = `${height}px`;
          }

          // Update WebGPU renderer size (this prevents gray background)
          rootRef.current.renderer?.setSize(width, height);

          // Update camera aspect
          if (rootRef.current.camera) {
            rootRef.current.camera.aspect = width / height;
            rootRef.current.camera.updateProjectionMatrix();
          }
        };

        window.addEventListener("resize", handleResize);
        // Call once to set initial size (avoids any mismatch on load)
        handleResize();

        // Store the cleanup function for later
        const cleanupResize = () => window.removeEventListener("resize", handleResize);

        // Override the return function to also remove resize listener
        const originalReturn = () => {
          cancelled = true;
          cleanupResize();
          try {
            if ((Root as any).instance && typeof (Root as any).instance.dispose === "function") {
              (Root as any).instance.dispose();
            } else if (scene && (scene as any).renderer && typeof (scene as any).renderer.setAnimationLoop === "function") {
              (scene as any).renderer.setAnimationLoop(null);
            }
          } catch (e) {}
        };
        // We'll replace the cleanup function later, but for now we need to keep it.
        // Instead, we'll attach the cleanup to the effect's return.
        return originalReturn;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setInitError(error);
        console.error("ThreeRoot init failed:", err);
      }
    };

    setup();

    return () => {
      cancelled = true;
      try {
        if ((Root as any).instance && typeof (Root as any).instance.dispose === "function") {
          (Root as any).instance.dispose();
        } else if (scene && (scene as any).renderer && typeof (scene as any).renderer.setAnimationLoop === "function") {
          (scene as any).renderer.setAnimationLoop(null);
        }
      } catch (e) {}
    };
  }, []);

  // Keep canvas size in sync with viewport (only canvas element, not renderer)
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  if (hasWebGPU === false) {
    return <div className="fixed inset-0 bg-[#0a0a0a] -z-10" aria-hidden />;
  }

  return (
    <>
      <canvas ref={canvasRef} id="threecanvas" data-engine="three.js r167 webgpu" />
      {initError && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-md border border-white/10 text-sm"
        >
          {initError.message}
        </div>
      )}
    </>
  );
}