import {
    BufferAttribute,
    BufferGeometry,
    Clock,
    OrthographicCamera,
    Points,
    PointsMaterial,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three';
import { ThreeController } from '@/views/3D/controllers/ThreeController';
import { shuffle } from 'lodash-es';

class PhysicalParticle {
    position: Vector3;

    speed: Vector3;

    acceleration: Vector3 = new Vector3(0, 0, 0);

    color: Float32Array;

    targetPosition: Vector3;

    constructor(generateWidth = 15, targetPosition: Vector3) {
        const distanceRange = [2, 7];
        const initSpeed = 3;
        const rand = () => Math.random() * generateWidth - generateWidth / 2;

        // eslint-disable-next-line
        while (true) {
            const tempPosition = new Vector3(rand(), rand(), 0);
            const distance = tempPosition.clone().sub(targetPosition).length();
            if (distance >= distanceRange[0] && distance <= distanceRange[1]) {
                this.position = tempPosition;
                break;
            }
        }

        this.speed = targetPosition
            .clone()
            .sub(this.position)
            .normalize()
            .multiplyScalar(initSpeed);

        this.color = new Float32Array([Math.random(), Math.random(), Math.random()]);
        this.targetPosition = targetPosition;
    }

    update(deltaTimeInSeconds: number) {
        const maxSpeed = 4;
        this.speed.add(this.acceleration.clone().multiplyScalar(deltaTimeInSeconds));
        if (this.speed.length() > maxSpeed) {
            this.speed.normalize().multiplyScalar(maxSpeed);
        }
        this.position.add(this.speed.clone().multiplyScalar(deltaTimeInSeconds));
    }
}

interface Effect {
    id: number;

    /**
     * 效果名
     */
    type: 'PointerGravity';

    /**
     * 目标点阻尼系数，粒子靠近目标点时，会逐渐减速
     */
    targetDampingConstant: number;

    /**
     * 目标点对粒子的吸引力常数
     */
    targetGravityConstant: number;

    /**
     * 鼠标对粒子的吸引力常数（可为负数，表示斥力）
     */
    pointerGravityConstant: number;

    /**
     * 用于获取当前鼠标位置的方法
     */
    getPointer: () => { x: number; y: number };
}

class GravityParticles extends Points {
    particles: Array<PhysicalParticle> = [];

    effects: Array<Effect> = [];

    count: number = 1;

    constructor({ count = 2500, generateWidth }: { count?: number; generateWidth?: number } = {}) {
        const geometry = new BufferGeometry();
        const material = new PointsMaterial({
            size: 4,
            sizeAttenuation: false,
        });
        super(geometry, material);

        material.depthTest = false; // 场景中只有粒子，停用深度测试以提高性能
        material.vertexColors = true;

        const imageWidth = 70;
        const imageHeight = 70;
        const particlesWidth = 10;
        const particlesHeight = 10;

        this.loadInitImage(imageWidth, imageHeight).then((imageData) => {
            this.loadPattern(imageData, particlesWidth, particlesHeight);
            geometry.setAttribute('position', new BufferAttribute(this.particlePositions, 3));
            geometry.setAttribute('color', new BufferAttribute(this.particleColors, 3));
        });
    }

    // constructor({ count = 1, generateWidth }: { count?: number; generateWidth?: number } = {}) {
    //     const geometry = new BufferGeometry();
    //     const material = new PointsMaterial({
    //         size: 4,
    //         sizeAttenuation: false,
    //     });
    //     super(geometry, material);
    //
    //     for (let i = 0; i < count; i++) {
    //         const targetPosition = new Vector3(0, 0, 0);
    //         this.particles.push(new PhysicalParticle(generateWidth, targetPosition));
    //     }
    //
    //     geometry.setAttribute('position', new BufferAttribute(this.particlePositions, 3));
    //     geometry.setAttribute('color', new BufferAttribute(this.particleColors, 3));
    //
    //     material.depthTest = false; // 场景中只有粒子，停用深度测试以提高性能
    //     material.vertexColors = true;
    // }

    get particlePositions() {
        const count = this.particles.length;
        const result = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const particle = this.particles[i];

            result[i * 3] = particle.position.x;
            result[i * 3 + 1] = particle.position.y;
            result[i * 3 + 2] = particle.position.z;
        }

        return result;
    }

    get particleColors() {
        const count = this.particles.length;
        const result = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const particle = this.particles[i];

            result[i * 3] = particle.color[0];
            result[i * 3 + 1] = particle.color[1];
            result[i * 3 + 2] = particle.color[2];
        }

        return result;
    }

    async loadInitImage(imageWidth?: number, imageHeight?: number) {
        const src = await import('@/assets/img/logo/logo_756x756.png');

        const img = await new Promise<HTMLImageElement>((resolve) => {
            const img = document.createElement('img');
            img.onload = () => resolve(img);
            img.src = src.default;
        });

        const canvas = document.createElement('canvas');
        let { width, height } = img;
        imageWidth && (width = imageWidth);
        imageHeight && (height = imageHeight);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx!.drawImage(img, 0, 0, width, height);
        const imageData = ctx!.getImageData(0, 0, width, height);

        img.remove();
        document.body.append(canvas);
        // canvas.remove();
        return imageData;
    }

    loadPattern(imageData: ImageData, particlesWidth: number, particlesHeight: number) {
        console.log(imageData);
        const len = imageData.data.length;
        const { width, height } = imageData;

        const colorThreshold = 10;
        const alphaThreshold = 10;

        const newTargetPositions: Array<Vector3> = [];

        for (let i = 0; i < len; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];

            if (a > 0) console.log(a);

            if (
                (r >= colorThreshold || g >= colorThreshold || b >= colorThreshold) &&
                a >= alphaThreshold
            ) {
                const x = (i / 4) % width;
                const y = Math.floor(i / 4 / width);
                const xInAxis = (x / width) * particlesWidth - particlesWidth / 2;
                const yInAxis = -((y / height) * particlesHeight - particlesHeight / 2);

                newTargetPositions.push(new Vector3(xInAxis, yInAxis, 0));
            }
        }

        this.updateParticles(shuffle(newTargetPositions));
    }

    updateParticles(targetPositions: Array<Vector3>) {
        let i = 0;
        const newLen = targetPositions.length;
        const oldLen = this.particles.length;
        if (newLen < oldLen) {
            const desertedParticles = this.particles.splice(newLen);
            console.log(this.particles.length, newLen);
        }
        while (i < newLen) {
            const newPos = targetPositions[i];
            if (i < oldLen) {
                this.particles[i].targetPosition = newPos;
            } else {
                this.particles.push(new PhysicalParticle(15, newPos));
            }
            i++;
        }
    }

    update(deltaTimeInSeconds: number) {
        const count = this.particles.length;
        this.updateEffect(deltaTimeInSeconds);

        this.particles.forEach((particle) => {
            particle.update(deltaTimeInSeconds);
        });

        this.geometry.setAttribute('position', new BufferAttribute(this.particlePositions!, 3));
    }

    addEffect(effect: Omit<Effect, 'id'>) {
        this.effects.push({ ...effect, id: this.count++ });
    }

    removeEffect(id: number) {
        const index = this.effects.findIndex((effect) => effect.id === id);
        if (index !== -1) {
            this.effects.splice(index, 1);
        }
    }

    updateEffect(deltaTimeInSeconds: number) {
        const effectHandlerMap = new Map([['PointerGravity', this.handleEffectPointerGravity]]);
        this.effects.forEach((effect) => {
            effectHandlerMap.get(effect.type)?.call(this, deltaTimeInSeconds, effect);
        });
    }

    handleEffectPointerGravity(deltaTimeInSeconds: number, effect: Effect) {
        const { pointerGravityConstant, targetGravityConstant, targetDampingConstant, getPointer } =
            effect;
        const { x: pointerX, y: pointerY } = getPointer();

        this.particles.forEach((particle) => {
            const { position, targetPosition, speed } = particle;

            const targetVector = targetPosition.clone().sub(position);
            const distance = targetVector.length();

            const acceleration = new Vector3();

            const gravityVector = targetVector
                .clone()
                .normalize()
                .multiplyScalar(targetGravityConstant * Math.max(distance ** 2, 1));
            acceleration.add(gravityVector);

            const targetDampingVector = speed
                .clone()
                .normalize()
                .multiplyScalar(
                    (-targetDampingConstant * speed.length() ** 2) / Math.max(distance, 0.1)
                    // Math.min(0, -targetDampingConstant * speed.length() ** 2 + 0.1)
                );
            acceleration.add(targetDampingVector);

            if (!isNaN(pointerX) && !isNaN(pointerY)) {
                // console.log(new Vector3(pointerX, pointerY, 0));
                const particleToPointerVector = new Vector3(pointerX, pointerY, 0).sub(position);
                const getGravity = () => {
                    const pointerDistance = particleToPointerVector.length();
                    if (pointerDistance < 0.4) {
                        return pointerGravityConstant / Math.max(pointerDistance, 0.01) ** 2;
                    } else {
                        return pointerGravityConstant / pointerDistance / 2;
                    }
                };
                const pointerGravity = particleToPointerVector
                    .clone()
                    .normalize()
                    .multiplyScalar(getGravity());
                acceleration.add(pointerGravity);
            }

            particle.acceleration = acceleration;
        });
    }
}

export class ParticleImageController extends ThreeController {
    static controllerName = 'ParticleImage';

    declare camera?: OrthographicCamera;

    particles?: GravityParticles;

    pointer: Vector2 = new Vector2(NaN, NaN);

    fnArrOnUnmount: Array<Function> = [];

    constructor(displayCanvasDom: HTMLCanvasElement) {
        super(displayCanvasDom);
    }

    mount() {
        const scene = new Scene();

        const cameraWidth = 10;
        const cameraHeight = 10;
        const cameraDepth = 10;
        const camera = new OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            0,
            cameraDepth
        );
        camera.position.z = cameraDepth / 2;
        scene.add(camera);

        const particles = new GravityParticles();
        particles.addEffect({
            type: 'PointerGravity',
            targetDampingConstant: 2,
            targetGravityConstant: 2,
            pointerGravityConstant: -2,
            getPointer: () => this.pointer,
        });
        scene.add(particles);

        const renderer = new WebGLRenderer({ canvas: this.displayCanvasDom });
        const clock = new Clock();

        const onPointerMove = (event: PointerEvent) => {
            this.pointer.x =
                (((event.offsetX / this.displayCanvasDom.offsetWidth) * 2 - 1) * cameraWidth) / 2;
            this.pointer.y =
                (-((event.offsetY / this.displayCanvasDom.offsetHeight) * 2 - 1) * cameraHeight) /
                2;
        };
        this.displayCanvasDom.addEventListener('pointermove', onPointerMove);
        this.fnArrOnUnmount.push(() => {
            this.displayCanvasDom.removeEventListener('pointermove', onPointerMove);
        });
        const onPointerLeave = () => {
            this.pointer.x = Number.NaN;
            this.pointer.x = Number.NaN;
        };
        this.displayCanvasDom.addEventListener('pointerleave', onPointerLeave);
        this.fnArrOnUnmount.push(() => {
            this.displayCanvasDom.removeEventListener('pointerleave', onPointerLeave);
        });

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.particles = particles;
        this.clock = clock;

        // const geometry = new BoxGeometry(1, 1, 1);
        // const material = new MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new Mesh(geometry, material);
        // scene.add(cube);

        this.render();
    }

    unmount() {
        this.fnArrOnUnmount.forEach((fn) => {
            fn();
        });
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.particles!.update(this.clock!.getDelta());
        this.renderer!.render(this.scene!, this.camera!); // 渲染一帧
    }
}

export default ParticleImageController;
