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
