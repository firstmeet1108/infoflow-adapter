import { Context, Adapter } from 'koishi'
import InfoflowBot from './bot'
import {} from '@koishijs/plugin-server'
import { AESCipher, getParam, getSignature, adaptSession } from './utils'

export class HttpServer<C extends Context = Context> extends Adapter<C, InfoflowBot<C>> {
  static inject = ['server']
  cipher: AESCipher
  constructor(ctx: C, bot: InfoflowBot<C>) {
    super(ctx)
  }

  async connect(bot: InfoflowBot){
    const { path, EncodingAESKey } = bot.config
    this.cipher = new AESCipher(EncodingAESKey)
    bot.ctx.server.post(path, async (ctx) => {
      const reqBody = ctx.request.body
      // 验证
      if(reqBody.echostr){
        if(getSignature(reqBody.rn, reqBody.timestamp, bot.config.token) === reqBody.signature) ctx.body = reqBody.echostr
        else throw new Error('签名错误')
        return
      }

      const param = getParam(ctx.request.url)
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
      console.log(session)
      theBot.dispatch(session)
    })
    bot.online()
  }
}
