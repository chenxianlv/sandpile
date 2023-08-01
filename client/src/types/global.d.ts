interface AnyObj {
    [prop: string]: any;
}
interface SimpleObj<T> {
    [prop: string]: T;
}
interface ResponseData extends AnyObj {
    data?: AnyObj;
    status: number;
}
