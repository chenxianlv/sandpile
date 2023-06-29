import type { Scene, Camera, WebGLRenderer } from 'three';

export abstract class ThreeController {
    static controllerName: string;

    scene?: Scene;
    camera?: Camera;
    renderer?: WebGLRenderer;

    constructor(displayCanvasDom: HTMLCanvasElement) {
        this.displayCanvasDom = displayCanvasDom;
    }

    displayCanvasDom: HTMLCanvasElement;

    abstract mount(): void;

    abstract unmount(): void;

    abstract render(): void;
}
