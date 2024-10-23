import { Context, Adapter } from 'koishi'
import InfoflowBot from './bot'
import {} from '@koishijs/plugin-server'
import CryptoJS from 'crypto-js'

export class HttpServer<C extends Context = Context> extends Adapter<C, InfoflowBot<C>> {
  static inject = ['server']
  cipher: AESCipher
  constructor(ctx: C, bot: InfoflowBot<C>) {
    super(ctx)
  }

  connect(bot: InfoflowBot){
    const { path, EncodingAESKey } = bot.config
    this.cipher = new AESCipher(EncodingAESKey)
    bot.ctx.server.post(path, (ctx) => {
      const body = ctx.request.body
      const res =  JSON.parse(this.cipher.decrypt(body))
      console.log(res.message.body)
      
    })
    return Promise.resolve()
  }

}

class AESCipher {
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
