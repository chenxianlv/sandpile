import type { Scene, Camera, WebGLRenderer, Clock } from 'three';

export abstract class ThreeController {
    static controllerName: string;

    scene?: Scene;
    camera?: Camera;
    renderer?: WebGLRenderer;
    clock?: Clock;

    protected constructor(displayCanvasDom: HTMLCanvasElement) {
        this.displayCanvasDom = displayCanvasDom;
    }

    displayCanvasDom: HTMLCanvasElement;

    abstract mount(): void;

    abstract unmount(): void;

    abstract render(): void;
}
