import { Context, Adapter } from 'koishi'
import InfoflowBot from './bot'
import {} from '@koishijs/plugin-server'
import crypto from 'crypto-js'

export class HttpServer<C extends Context = Context> extends Adapter<C, InfoflowBot<C>> {
  static inject = ['server']
  constructor(ctx: C, bot: InfoflowBot<C>) {
    super(ctx)
  }

  connect(bot: InfoflowBot){
    const { path } = bot.config
    bot.ctx.server.post(path, (ctx) => {
      const body = ctx.request.body
      console.log(btoa(body))
    })
    return Promise.resolve()
  }

}

function btoa(str: string) { return Buffer.from(str).toString('utf-8') }

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipheriv('aes-128-ccm', key, '1234567890123456', 10);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

