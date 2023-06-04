import CryptoJS from 'crypto-js';

export function encryptPwd(pwd: string, account: string) {
    return CryptoJS.MD5(CryptoJS.MD5(pwd).toString().toUpperCase() + account)
        .toString()
        .toUpperCase();
}
