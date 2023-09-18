import CryptoJS from 'crypto-js';

export function encryptPwd(pwd: string, username: string) {
    return CryptoJS.MD5(CryptoJS.MD5(pwd).toString().toUpperCase() + username)
        .toString()
        .toUpperCase();
}
