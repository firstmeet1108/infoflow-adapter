import { Context, Adapter } from 'koishi'
import InfoflowBot from './bot'
import {} from '@koishijs/plugin-server'
import { AESCipher, getParam, getSignature, adaptSession } from './utils'
import { requestUrlParam } from './type'

export class HttpServer<C extends Context = Context> extends Adapter<C, InfoflowBot<C>> {
  static inject = ['server']
  cipher: AESCipher
  constructor(ctx: C, bot: InfoflowBot<C>) {
    super(ctx)
  }
  fork(ctx: C, bot: InfoflowBot<C>) {
    super.fork(ctx, bot)
    return bot.initialize()
  }

  async connect(bot: InfoflowBot){
    const { path, EncodingAESKey } = bot.config
    this.cipher = new AESCipher(EncodingAESKey)
    bot.ctx.server.post(path, async (ctx) => {
      console.log(123)
      const reqBody = ctx.request.body
      // 验证
      if(reqBody.echostr){
        if(getSignature(reqBody.rn, reqBody.timestamp, bot.config.token) === reqBody.signature) ctx.body = reqBody.echostr
        else throw new Error('签名错误')
        return
      }

      const param = getParam(ctx.request.url) as requestUrlParam
      if(!param.signature || !param.timestamp || !param.rn || getSignature(param.rn, param.timestamp, bot.config.token) !== param.signature){
        ctx.body = 'fail'
        ctx.status = 403
        return
      }
      const res = this.cipher.decrypt(reqBody)
      const { message: { body } } = res
      const { robotid } = body.find((item) => {
        return '' + item?.robotid === bot.config.robotId
      })
      if(!robotid) return
      const theBot = this.bots.find((item) => item.config.robotId === '' + robotid)
      const session = adaptSession(theBot, body)
      theBot.dispatch(session)
    })
  }
}
