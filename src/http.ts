import { Context, Adapter } from 'koishi'
import InfoflowBot from './bot'
import {} from '@koishijs/plugin-server'
import { AESCipher, getParam, getSignature } from './utils'

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
      // 验证
      if(body.echostr){
        if(getSignature(body.rn, body.timestamp, bot.config.token) === body.signature) ctx.body = body.echostr
        else throw new Error('签名错误')
        return
      }

      const param = getParam(ctx.request.url)
      if(!param.signature || !param.timestamp || !param.rn || getSignature(param.rn, param.timestamp, bot.config.token) !== param.signature){
        ctx.body = 'fail'
        ctx.status = 403
        return
      }
      const res =  JSON.parse(this.cipher.decrypt(body))
    })
    return Promise.resolve()
  }
}
