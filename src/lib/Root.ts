// src/lib/Root.ts
 
// @ts-nocheck
import { Clock, PerspectiveCamera, Scene, SRGBColorSpace } from "three/webgpu";
import { IAnimatedElement } from "./interfaces/IAnimatedElement";
import { pass, PostProcessing, WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { LinkedParticles } from "./elements/LinkedParticles";

export class Root {
    static instance: Root;
    animatedElements: IAnimatedElement[] = [];
    static zoomPercent: number = 0;

    static registerAnimatedElement(element: IAnimatedElement) {
        if (Root.instance == null) throw new Error("Root instance not found");
        if (Root.instance.animatedElements.indexOf(element) == -1) Root.instance.animatedElements.push(element);
    }

    canvas: HTMLCanvasElement;
    renderer?: WebGPURenderer;
    clock: Clock = new Clock(false);
    post?: PostProcessing;
    camera: PerspectiveCamera = new PerspectiveCamera(70, 1, .01, 1000);
    controls?: OrbitControls;
    postProcessing?: PostProcessing;
    scene: Scene = new Scene();
    fx: LinkedParticles;
    capturing: boolean = false;

    // Removed adaptive scaling fields – not needed
    // resolutionScale, targetFps, frameTimes, lastRenderTime, resizeHandler, visibilityHandler removed

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        if (Root.instance != null) return;
        Root.instance = this;
    }

    async init() {
        this.initRenderer();
        this.initCamera();
        this.initPost();
        await this.initScene();
        this.clock.start();
        this.renderer!.setAnimationLoop(this.animate.bind(this));
        return new Promise((resolve) => resolve());
    }

    initRenderer() {
        if (typeof WebGPU === 'undefined' || WebGPU.isAvailable() === false) throw new Error('No WebGPU support');
        this.renderer = new WebGPURenderer({ canvas: this.canvas, antialias: false, alpha: true });
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.renderer.setPixelRatio(1);
        // Set size once – no resize listener to avoid flicker
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // ❌ Removed resize event listener (causes flicker on load)
        // ❌ Removed visibilitychange listener
    }

    initCamera() {
        const aspect: number = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.position.z = 5;
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableZoom = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 30;
        this.controls.target.set(0, 0, 0);
    }

    initPost() {
        const scenePass = pass(this.scene, this.camera);
        this.postProcessing = new PostProcessing(this.renderer!);
        this.postProcessing.outputNode = scenePass;
    }

    async initScene() {
        this.fx = new LinkedParticles(this.scene, this.camera, this.controls, this.renderer!, this.postProcessing);
        await this.fx.init();
    }

    // ❌ Removed onResize() entirely – no resizing

    animate() {
        if (!this.capturing) {
            const dt: number = this.clock.getDelta();
            const elapsed: number = this.clock.getElapsedTime();

            try {
                this.controls!.update(dt);
                this.animatedElements.forEach((element) => element.update(dt, elapsed));
                this.postProcessing!.render();
            } catch (err) {
                console.warn('Render frame failed, skipping:', err);
                return;
            }

            if (this.controls) {
                const zoomRange = this.controls.maxDistance - this.controls.minDistance;
                const currentZoom = this.camera.position.z - this.controls.minDistance;
                Root.zoomPercent = Math.max(0, Math.min(100, Math.round((1 - (currentZoom / zoomRange)) * 100)));
            }
        }
    }

    static StartCapture(): void {
        if (Root.instance && !Root.instance.capturing) Root.instance.capture();
    }

    async capture() {
        this.capturing = true;
        await new Promise(resolve => setTimeout(resolve, 20));
        await this.postProcessing!.renderAsync();
        const imgData = this.renderer.domElement.toDataURL("image/jpeg", 1.0);
        const link = document.createElement('a');
        link.download = `rhine_render_${Date.now()}.jpg`;
        link.href = imgData;
        link.click();
        this.capturing = false;
    }

    dispose() {
        try {
            if (this.renderer && typeof (this.renderer as any).setAnimationLoop === 'function') {
                (this.renderer as any).setAnimationLoop(null);
            }
            try {
                if (this.renderer && typeof (this.renderer as any).dispose === 'function') (this.renderer as any).dispose();
            } catch (e) {}
            try {
                this.scene.traverse((obj: any) => {
                    if (obj.geometry) try { obj.geometry.dispose(); } catch (e) {}
                    if (obj.material) {
                        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { try { m.dispose(); } catch (e) {} });
                        else try { obj.material.dispose(); } catch (e) {}
                    }
                });
            } catch (e) {}
        } finally {
            try { (Root as any).instance = undefined; } catch (e) {}
        }
    }
}