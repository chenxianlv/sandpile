declare interface SimpleObj<T> {
    [prop: string]: T | undefined;
}

declare interface ResponseData<T = undefined> {
    data: T;
    status: number;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare interface HTMLInputElement {
    directory: boolean;
}
