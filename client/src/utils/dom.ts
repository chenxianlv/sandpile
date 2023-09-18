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
