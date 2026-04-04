import React, { useEffect, useRef, useState } from "react";
import { Root } from "../lib/Root";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";

export default function ThreeRoot(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

        // WebGPU.isAvailable may return boolean or Promise<boolean>.
        // Await handles both sync and async return values.
        let available = false;
        try {
          if (typeof WebGPU?.isAvailable !== "function") {
            available = false;
          } else {
            // await works whether isAvailable returns boolean or Promise<boolean>
            // (TypeScript inference of Promise vs boolean is handled by await)
            // eslint-disable-next-line @typescript-eslint/await-thenable
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
        await scene.init();
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setInitError(error);
        // visible console error for debugging
        // eslint-disable-next-line no-console
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
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  // Keep canvas size in sync with viewport
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

  // If we've determined WebGPU is unavailable, render a safe static fallback
  if (hasWebGPU === false) {
    return <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black -z-10" aria-hidden />;
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
