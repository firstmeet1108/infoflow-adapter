import CryptoJS from 'crypto-js';
import { Context, h } from 'koishi';
import InfoflowBot from './bot';
import { MessageRequest, BodyItem } from './type';
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
  decrypt(content): MessageRequest {
    content = content
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(content.length + content.length % 4, '=')
    const bytes = CryptoJS.AES.decrypt(content, this.key, this.options);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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

export function adaptSession<c extends Context>(bot: InfoflowBot<c>, body: Array<BodyItem>) {
  const session = bot.session();
  session.setInternal('infoflow', body);
  session.type = 'message'
  session.elements = body.map(adaptMessage);
  return session
}

function adaptMessage(item: BodyItem): h | null {
  switch(item.type){
    case 'AT':
      if(item.robotid) return null
      return h.at(item.userid, { name: item.name })
    case 'IMAGE':
      return h.image(item.downloadurl)
    case 'LINK':
      return h.text(item.label)
    case 'command':
      return h.text(item.commandname)
    case 'TEXT':
      return h.text(item.content)
  }
}
