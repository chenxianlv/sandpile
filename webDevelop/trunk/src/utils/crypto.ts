import CryptoJS from 'crypto-js';

// todo 可改用更严格的安全策略
export function encryptPwd(pwd: string, salt = '') {
    return CryptoJS.MD5(CryptoJS.MD5(pwd).toString().toUpperCase() + salt)
        .toString()
        .toUpperCase();
}
