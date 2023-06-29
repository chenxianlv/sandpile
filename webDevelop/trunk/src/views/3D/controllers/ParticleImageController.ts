import * as THREE from 'three';
import { ThreeController } from '@/views/3D/controllers/ThreeController';

export class PhysicalParticle extends THREE.Points {
    speedVector = new THREE.Vector2(0, 0);
    accelerationVector = new THREE.Vector2(0, 0);

    constructor() {
        super();
    }
}

export class ParticleImageController extends ThreeController {
    static controllerName = 'ParticleImage';

    declare camera?: THREE.OrthographicCamera;

    constructor(displayCanvasDom: HTMLCanvasElement) {
        super(displayCanvasDom);
    }

    mount() {
        const scene = new THREE.Scene();

        const cameraWidth = 10;
        const cameraHeight = 10;
        const cameraDepth = 10;
        const camera = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            cameraDepth
        );
        camera.position.z = cameraDepth / 2;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({ canvas: this.displayCanvasDom });

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        this.render();
    }

    unmount() {}

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer!.render(this.scene!, this.camera!); // 渲染一帧
    }
}

export default ParticleImageController;
