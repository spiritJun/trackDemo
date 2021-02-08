/**
 * 通过crypto-js实现 加解密工具
 * AES、HASH(MD5、SHA256)、base64
 * @author: ldy
 */
import CryptoJS from 'crypto-js';
// import {getToken} from '@/utils/auth'
// const keyString = getToken() || '';
// console.error(keyString)
// const key = keyString.substring(0, 16);
// const KP = {
//     key: key, // 秘钥 16*n:
//     iv: key // 偏移量
// };
function getAesString(data, key, iv) { // 加密
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(data, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.toString(); // 返回的是base64格式的密文
}

function getDAesString(encrypted, key, iv) { // 解密
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// AES 对称秘钥加密
const aes = {
    en: (data, KP) => getAesString(data, KP.key, KP.iv),
    de: (data, KP) => getDAesString(data, KP.key, KP.iv)
};
// BASE64
const base64 = {
    en: data => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
    de: data => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
};
// SHA256
const sha256 = data => CryptoJS.SHA256(data).toString();
// MD5
const md5 = data => CryptoJS.MD5(data).toString();

/**
 * 签名
 * @param ssid 会话id
 * @param nonce 随机数
 * @param timestamp 签名时间戳
 */
const sign = (KP, ssid, nonce, timestamp) => {
    const signsrc = ssid + nonce + timestamp;
    const aesEn = aes.en(signsrc, KP);
    const md5aesEn = md5(aesEn);
    return md5aesEn;
};
/* 登录密码加密 */
const password = (KP, password) => {
    const aesPass = aes.en(password, KP);
    return aesPass;
};

/* 登录用户名加密 */
const uname = (KP, username) => {
    const aesUser = aes.en(username, KP);
    return aesUser;
};
export {
    aes,
    md5,
    sha256,
    base64,
    sign,
    password,
    uname
};
