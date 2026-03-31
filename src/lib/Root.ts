// @ts-nocheck
import { ACESFilmicToneMapping, Clock, PerspectiveCamera, Scene, Vector2, Vector3 } from "three/webgpu";
import { IAnimatedElement } from "./interfaces/IAnimatedElement";
import { pass, PostProcessing, WebGPURenderer } from "three/webgpu";
import { OrbitControls, TrackballControls } from "three/examples/jsm/Addons.js";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
import { LinkedParticles } from "./elements/LinkedParticles";

export class Root {
    static instance: Root;
    animatedElements: IAnimatedElement[] = [];
    
    // Stores the vertical rotation value based on scroll
    scrollRotation: number = 0;
    
    // NEW: Static variable for React to read the zoom level
    static zoomPercent: number = 0;

    static registerAnimatedElement(element: IAnimatedElement) {
        if (Root.instance == null) throw new Error("Root instance not found");
        if (Root.instance.animatedElements.indexOf(element) == -1) Root.instance.animatedElements.push(element);
    }

    canvas: HTMLCanvasElement;

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

    renderer?: WebGPURenderer;
    clock: Clock = new Clock(false);
    post?: PostProcessing;

    initRenderer() {
        if (WebGPU.isAvailable() === false) throw new Error('No WebGPU support');
        this.renderer = new WebGPURenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', this.onResize.bind(this));
    }

    camera: PerspectiveCamera = new PerspectiveCamera(70, 1, .01, 1000);
    controls?: OrbitControls;

    initCamera() {
        const aspect: number = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.position.z = 5;
        this.camera.updateProjectionMatrix();

        // Attach controls to canvas to prevent blocking UI touches
        this.controls = new OrbitControls(this.camera, this.canvas);
        
        this.controls.enableZoom = false; 
        this.controls.minDistance = 3;  
        this.controls.maxDistance = 30; 
        this.controls.target.set(0, 0, 0);

        // Use window scroll for reliable cross‑platform behaviour
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollPercentage = maxScroll > 0 ? scrollY / maxScroll : 0;
            this.scrollRotation = scrollPercentage * Math.PI * 2;
        });
    }

    postProcessing?: PostProcessing;
    initPost() {
        const scenePass = pass(this.scene, this.camera);
        this.postProcessing = new PostProcessing(this.renderer!);
        this.postProcessing.outputNode = scenePass;
    }

    scene: Scene = new Scene();
    fx: LinkedParticles;
    async initScene() {
        this.fx = new LinkedParticles(this.scene, this.camera, this.controls, this.renderer!, this.postProcessing);
        await this.fx.init();       
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer!.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.capturing) {
            const dt: number = this.clock.getDelta();
            const elapsed: number = this.clock.getElapsedTime();

            this.scene.rotation.x = this.scrollRotation;
            this.controls!.update(dt);
            this.animatedElements.forEach((element) => element.update(dt, elapsed));
            this.postProcessing!.render();

            // NEW: UPDATE ZOOM PERCENTAGE FOR HUD
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

    capturing: boolean = false;
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
}