declare interface SimpleObj<T> {
    [prop: string]: T | undefined;
}

declare interface ResponseData<T = undefined> {
    data: T;
    status: number;
}

declare module '*.vue' {
    import { defineComponent } from 'vue';
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}

declare interface HTMLInputElement {
    directory: boolean;
}
