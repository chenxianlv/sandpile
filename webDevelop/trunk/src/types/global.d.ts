interface anyObj {
    [prop: string]: any;
}
interface ResponseData extends anyObj {
    data?: anyObj;
    status: number;
}
