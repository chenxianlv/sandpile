import type { Scene, Camera, WebGLRenderer, Clock } from 'three';

export abstract class ThreeController {
    static controllerName: string;

    scene?: Scene;
    camera?: Camera;
    renderer?: WebGLRenderer;
    clock?: Clock;

    protected constructor(displayCanvasDom: HTMLCanvasElement, guiContainerDom?: HTMLElement) {
        this.displayCanvasDom = displayCanvasDom;
        guiContainerDom && (this.guiContainerDom = guiContainerDom);
    }

    displayCanvasDom: HTMLCanvasElement;

    guiContainerDom?: HTMLElement;

    abstract mount(): void;

    abstract unmount(): void;

    abstract render(): void;
}
