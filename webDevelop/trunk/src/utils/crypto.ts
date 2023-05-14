import CryptoJS from 'crypto-js';

// todo 可改用更严格的安全策略
export function encryptPwd(pwd: string, account: string) {
    return CryptoJS.MD5(CryptoJS.MD5(pwd).toString().toUpperCase() + account)
        .toString()
        .toUpperCase();
}
