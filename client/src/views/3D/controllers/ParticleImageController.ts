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
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { shuffle } from 'lodash-es';
import { ThreeController } from '@/views/3D/controllers/ThreeController';
import { i18n } from '@/lang';

const $t = i18n.global.t;

class PhysicalParticle {
    position: Vector3;

    speed: Vector3;

    acceleration: Vector3 = new Vector3(0, 0, 0);

    color: Float32Array;

    targetPosition: Vector3;

    config: ParticlesConfig;

    constructor(targetPosition: Vector3, config: ParticlesConfig) {
        const {
            particlesGenerateWidth: generateWidth,
            particlesGenerateDistanceRange: distanceRange,
            particlesGenerateRetryLimit: retryLimit,
            particlesGenerateSpeed: initSpeed,
            particlesGrayScale: grayScale,
        } = config;

        const rand = () => Math.random() * generateWidth - generateWidth / 2;
        let count = 0;

        // eslint-disable-next-line
        while (true) {
            const tempPosition = new Vector3(rand(), rand(), 0);
            const distance = tempPosition.clone().sub(targetPosition).length();
            if (
                count++ <= retryLimit ||
                (distance >= distanceRange[0] && distance <= distanceRange[1])
            ) {
                if (import.meta.env.DEV && count > retryLimit) console.error('超过重试次数');
                this.position = tempPosition;
                break;
            }
        }

        this.speed = targetPosition
            .clone()
            .sub(this.position)
            .normalize()
            .multiplyScalar(initSpeed);

        const randColor = Math.random() * Math.abs(grayScale[1] - grayScale[0]) + grayScale[0];
        this.color = new Float32Array([randColor, randColor, randColor]);
        this.targetPosition = targetPosition;
        this.config = config;
    }

    update(deltaTimeInSeconds: number) {
        const { particlesMaxSpeed: maxSpeed } = this.config;
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

    config: ParticlesConfig;

    imageData?: ImageData;

    count: number = 1;

    constructor(config: ParticlesConfig) {
        const { particlesSize } = config;

        const geometry = new BufferGeometry();
        const material = new PointsMaterial({
            size: particlesSize,
            sizeAttenuation: false,
        });
        material.depthTest = false; // 场景中只有粒子，停用深度测试以提高性能
        material.vertexColors = true;

        super(geometry, material);
        this.config = config;
        this.loadInitImage().then(() => {
            this.loadPattern(this.imageData!);
        });
    }

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

    async loadInitImage() {
        const src = await import('@/assets/img/logo/logo_756x756.png');
        return await this.loadImage(src.default);
    }

    async loadImage(src: string) {
        const img = await new Promise<HTMLImageElement>((resolve) => {
            const img = document.createElement('img');
            img.onload = () => resolve(img);
            img.src = src;
        });

        const canvas = document.createElement('canvas');
        const { particlesNumInWidth: width, particlesNumInHeight: height } = this.config;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx!.drawImage(img, 0, 0, width, height);
        const imageData = ctx!.getImageData(0, 0, width, height);

        img.remove();
        canvas.remove();

        this.imageData = imageData;
        return imageData;
    }

    loadPattern(imageData: ImageData) {
        const len = imageData.data.length;
        const { width, height } = imageData;

        const {
            particlesGenerateColorThreshold: colorThreshold,
            particlesGenerateAlphaThreshold: alphaThreshold,
            particlesWidth,
            particlesHeight,
        } = this.config;

        const newTargetPositions: Array<Vector3> = [];

        for (let i = 0; i < len; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];

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

        this.updateParticles(shuffle(newTargetPositions), false);
    }

    /**
     * 根据目标点数组，更新粒子数组，若现有粒子数不足，则生成新粒子。若现有粒子数过多，则删除多余粒子。
     */
    updateParticles(targetPositions: Array<Vector3>, fadeOut = true) {
        let i = 0;
        const newLen = targetPositions.length;
        const oldLen = this.particles.length;
        if (newLen < oldLen) {
            if (fadeOut) {
                // todo 补充淡出效果
            } else {
                this.particles.splice(newLen);
            }
        }
        while (i < newLen) {
            const newPos = targetPositions[i];
            if (i < oldLen) {
                this.particles[i].targetPosition = newPos;
            } else {
                this.particles.push(new PhysicalParticle(newPos, this.config));
            }
            i++;
        }
        this.geometry.setAttribute('position', new BufferAttribute(this.particlePositions, 3));
        this.geometry.setAttribute('color', new BufferAttribute(this.particleColors, 3));
    }

    update(deltaTimeInSeconds: number) {
        this.updateEffect(deltaTimeInSeconds);

        this.particles.forEach((particle) => {
            particle.update(deltaTimeInSeconds);
        });

        this.geometry.setAttribute('position', new BufferAttribute(this.particlePositions!, 3));
    }

    // addEffect(effect: Omit<Effect, 'id'>) {
    //     const id = this.count++;
    //     this.effects.push({ ...effect, id });
    //     return id;
    // }

    // removeEffect(id: number) {
    //     const index = this.effects.findIndex((effect) => effect.id === id);
    //     if (index !== -1) {
    //         this.effects.splice(index, 1);
    //     }
    // }

    updateEffect(deltaTimeInSeconds: number) {
        const effectHandlerMap = new Map([['PointerGravity', this.handleEffectPointerGravity]]);
        this.config.effects.forEach((effect) => {
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
                    (-targetDampingConstant * speed.length() ** 2) / Math.max(distance, 0.01)
                    // Math.min(0, -targetDampingConstant * speed.length() ** 2 + 0.1)
                );
            acceleration.add(targetDampingVector);

            if (!isNaN(pointerX) && !isNaN(pointerY)) {
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

interface ParticlesConfig {
    /**
     * 粒子大小
     */
    particlesSize: number;

    /**
     * 粒子灰度范围，第一位为下限，第二位为上限
     */
    particlesGrayScale: [number, number];

    /**
     * x方向上的粒子栅格数
     */
    particlesNumInWidth: number;

    /**
     * y方向上的粒子栅格数
     */
    particlesNumInHeight: number;

    /**
     * 粒子图案的宽度
     */
    particlesWidth: number;

    /**
     * 粒子图案的高度
     */
    particlesHeight: number;

    /**
     * 效果器，用于自定义控制粒子
     */
    effects: Array<Effect>;

    /**
     * 粒子生成矩形的宽高。粒子只会在该矩形中生成
     */
    particlesGenerateWidth: number;

    /**
     * 粒子生成距离限制，数组第一位表示最小距离，数组第二位表示最大距离
     */
    particlesGenerateDistanceRange: [number, number];

    /**
     * 单个粒子生成时的重试次数上限。粒子生成时，会随机在生成矩形中选取一个位置，若该位置不符合生成距离限制，则会重试。
     */
    particlesGenerateRetryLimit: number;

    /**
     * 粒子生成时的速度，方向会指向该粒子的目的地
     */
    particlesGenerateSpeed: number;

    /**
     * 粒子生成的颜色阈值。图片中某像素的rgb中的所有颜色都小于该阈值时，不会在该处生成粒子
     */
    particlesGenerateColorThreshold: number;

    /**
     * 粒子可见的不透明度阈值。图片中某像素的不透明度小于该阈值时，不会在该处生成粒子
     */
    particlesGenerateAlphaThreshold: number;

    /**
     * 粒子最大速度
     */
    particlesMaxSpeed: number;
}

export class ParticleImageController extends ThreeController {
    static controllerName = 'ParticleImage';

    declare camera?: OrthographicCamera;

    particles?: GravityParticles;

    pointer: Vector2 = new Vector2(NaN, NaN);

    fnArrOnUnmount: Array<Function> = [];

    particlesConfig: ParticlesConfig = this.initConfig;

    gui?: GUI;

    constructor({
        canvas,
        guiContainer,
    }: {
        canvas: HTMLCanvasElement;
        guiContainer: HTMLElement;
    }) {
        super(canvas, guiContainer);
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

        const particles = new GravityParticles(this.particlesConfig);
        scene.add(particles);
        this.generateGui();
        this.fnArrOnUnmount.push(() => {
            this.gui?.destroy();
        });

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

        this.render();
    }

    get initConfig(): ParticlesConfig {
        return {
            particlesSize: 4,
            particlesGrayScale: [0.2, 0.6],
            particlesWidth: 10,
            particlesHeight: 10,
            particlesNumInWidth: 70,
            particlesNumInHeight: 70,
            effects: [
                {
                    id: 1,
                    type: 'PointerGravity',
                    targetDampingConstant: 2,
                    targetGravityConstant: 2,
                    pointerGravityConstant: -2,
                    getPointer: () => this.pointer,
                },
            ],
            particlesGenerateWidth: 15,
            particlesGenerateDistanceRange: [2, 7],
            particlesGenerateRetryLimit: 100,
            particlesGenerateColorThreshold: 10,
            particlesGenerateAlphaThreshold: 10,
            particlesGenerateSpeed: 3,
            particlesMaxSpeed: 4,
        };
    }

    generateGui() {
        if (this.gui) this.gui.destroy();
        const gui = new GUI({ container: this.guiContainerDom, width: 300 });
        const btnFnObj = {
            regenerate: () => {
                const { particles } = this;
                // @ts-ignore
                if (particles?.material?.size !== undefined) {
                    // @ts-ignore
                    particles.material.size = particles?.config.particlesSize;
                }
                particles?.updateParticles([], false);
                particles?.imageData && particles?.loadPattern(particles.imageData);
                this.generateGui();
            },
            reload: () => {
                this.scene!.remove(this.particles!);
                this.particlesConfig = this.initConfig;
                this.particles = new GravityParticles(this.particlesConfig);
                this.scene!.add(this.particles);
                this.generateGui();
            },
            upload: () => {},
        };

        type NumberFieldsConfig = {
            name: string;
            obj: Object;
            property: string;
            min: number;
            max: number;
            step: number;
        };
        const particlesConfig = this.particlesConfig;
        const numberFieldsConfigs: Array<NumberFieldsConfig> = [
            {
                name: $t('3d.particleImage.particlesSize'),
                obj: particlesConfig,
                property: 'particlesSize',
                min: 0.1,
                max: 20,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesMinGrayScale'),
                obj: particlesConfig.particlesGrayScale,
                property: '0',
                min: 0,
                max: 1,
                step: 0.01,
            },
            {
                name: $t('3d.particleImage.particlesMaxGrayScale'),
                obj: particlesConfig.particlesGrayScale,
                property: '1',
                min: 0,
                max: 1,
                step: 0.01,
            },
            {
                name: $t('3d.particleImage.particlesWidth'),
                obj: particlesConfig,
                property: 'particlesWidth',
                min: 1,
                max: 20,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesHeight'),
                obj: particlesConfig,
                property: 'particlesHeight',
                min: 1,
                max: 20,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesNumInWidth'),
                obj: particlesConfig,
                property: 'particlesNumInWidth',
                min: 1,
                max: 300,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesNumInHeight'),
                obj: particlesConfig,
                property: 'particlesNumInHeight',
                min: 1,
                max: 300,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateWidth'),
                obj: particlesConfig,
                property: 'particlesGenerateWidth',
                min: 1,
                max: 300,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateMinDistance'),
                obj: particlesConfig.particlesGenerateDistanceRange,
                property: '0',
                min: 0.1,
                max: 300,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateMaxDistance'),
                obj: particlesConfig.particlesGenerateDistanceRange,
                property: '1',
                min: 0.1,
                max: 300,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateRetryLimit'),
                obj: particlesConfig,
                property: 'particlesGenerateRetryLimit',
                min: 0,
                max: 30000,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateColorThreshold'),
                obj: particlesConfig,
                property: 'particlesGenerateColorThreshold',
                min: 0,
                max: 256,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateAlphaThreshold'),
                obj: particlesConfig,
                property: 'particlesGenerateAlphaThreshold',
                min: 0,
                max: 256,
                step: 1,
            },
            {
                name: $t('3d.particleImage.particlesGenerateSpeed'),
                obj: particlesConfig,
                property: 'particlesGenerateSpeed',
                min: 0,
                max: 50,
                step: 0.1,
            },
            {
                name: $t('3d.particleImage.particlesMaxSpeed'),
                obj: particlesConfig,
                property: 'particlesMaxSpeed',
                min: 0,
                max: 50,
                step: 0.1,
            },
        ];

        const upload = gui.add(btnFnObj, 'upload').name($t('3d.particleImage.selectTemplate'));
        const containerDom = upload.domElement.getElementsByClassName('widget')[0];

        const uploadBtnDom = document.createElement('input');
        uploadBtnDom.type = 'file';
        uploadBtnDom.style.cssText =
            'position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; cursor: pointer';
        uploadBtnDom.addEventListener('change', (e) => {
            // @ts-ignore
            const file = e.target?.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (result) {
                        this.particles!.loadImage(result as string).then((imageData) => {
                            this.particles!.loadPattern(imageData);
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        containerDom.append(uploadBtnDom);

        gui.add(btnFnObj, 'regenerate').name($t('3d.particleImage.regenerate'));
        gui.add(btnFnObj, 'reload').name($t('3d.particleImage.reload'));
        numberFieldsConfigs.forEach(({ obj, property, min, max, step, name }) => {
            gui.add(obj, property, min, max, step)
                .name(name)
                .onFinishChange(() => {
                    btnFnObj.regenerate();
                });
        });
        gui.open();
        this.gui = gui;
    }

    unmount() {
        this.fnArrOnUnmount.forEach((fn) => {
            fn();
        });
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        const deltaTimeInSeconds = this.clock!.getDelta();
        if (deltaTimeInSeconds < 1) {
            this.particles!.update(deltaTimeInSeconds);
        }
        this.renderer!.render(this.scene!, this.camera!); // 渲染一帧
    }
}

export default ParticleImageController;
