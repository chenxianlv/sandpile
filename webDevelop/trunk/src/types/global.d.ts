interface AnyObj {
    [prop: string]: any;
}
interface ResponseData extends AnyObj {
    data?: AnyObj;
    status: number;
}
