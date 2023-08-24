interface AnyObj {
    [prop: string]: any;
}
interface SimpleObj<T> {
    [prop: string]: T;
}
interface ResponseData<T = undefined> extends AnyObj {
    data: T;
    status: number;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
