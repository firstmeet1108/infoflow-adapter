import CryptoJS from 'crypto-js';

export class AESCipher {
  key: CryptoJS.lib.WordArray;
  options: any;
  constructor(key: string) {
    this.key = CryptoJS.enc.Base64.parse(key);
    this.options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
  }
  // 加密
  encrypt(data) {
    const cipher = CryptoJS.AES.encrypt(data, this.key, this.options);
    const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
    const resultCipher = base64Cipher
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    return resultCipher;
  }
  // 解密
  decrypt(content) {
    content = content
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(content.length + content.length % 4, '=')
    const bytes = CryptoJS.AES.decrypt(content, this.key, this.options);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

export function getParam(url: string): {
  signature?: string;
  rn?: string;
  timestamp?: string;
  echostr?: string;
} {
  const search = url.split('?')[1];
  if (!search) return {};
  return search.split('&').reduce((pre, curr) => {
    const [key, val] = curr.split('=');
    return { ...pre, [key]: decodeURIComponent(val) };
  }, {});
}

export function getSignature(rn: string, timestamp: string, token: string) {
  return CryptoJS
    .MD5(`${rn}${timestamp}${token}`)
    .toString()
}

