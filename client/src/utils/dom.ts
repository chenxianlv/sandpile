// /**
//  * 将包含数据的对象转换为查询字符串格式
//  * 如：{account: 'chen', pwd: '123'} => 'account=chen&pwd=123'
//  */
// export function transObjToParamsString(obj: SimpleObj<any>) {
//     return Object.entries(obj)
//         .map((entry) => {
//             return entry.join('=');
//         })
//         .join('&');
// }

export function getLocalStorage(key: string, needParse = true) {
    try {
        const str = window.localStorage.getItem(key);

        if (!needParse || str === null) return str;
        return JSON.parse(str);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function setLocalStorage(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
}
