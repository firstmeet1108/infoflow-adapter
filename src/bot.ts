import { Context, Schema, Bot, HTTP } from 'koishi'
import { Internal } from './type';
import { HttpServer } from './http';
import { getParam } from './utils'
export class InfoflowBot<C extends Context = Context> extends Bot<C, InfoflowBot.Config> {
  static inject = ['server', 'http'];
  http: HTTP
  internal: Internal
  constructor(ctx: C, config: InfoflowBot.Config) {
    super(ctx, config, 'infoflow')
    const { access_token } = getParam(config.targetUrl) as { access_token: string }

    this.http = ctx.http.extend({
      endpoint: 'http://apiin.im.baidu.com/api/',
    })
    this.internal = new Internal(this)

    ctx.plugin(HttpServer, this);
  }
}

export namespace InfoflowBot {
  export interface Config {
    name: string;
    robotId: string;
    targetUrl: string;
    selfUrl?: string;
    port?: number;
    token?: string;
    EncodingAESKey?: string;
    path?: string;
  }

  export const Config: Schema<Config> = Schema.object({
    targetUrl: Schema.string().description('目标 URL'),
    name: Schema.string().description('机器人名称'),
    robotId: Schema.string().description('机器人 ID'),
    selfUrl: Schema.string().default('localhost').description('机器人 URL'),
    port: Schema.number().default(80).description('端口号'),
    token: Schema.string().description('安全令牌'),
    EncodingAESKey: Schema.string().description('消息加解密密钥'),
    path: Schema.string().default('/infoflow').description('路径'),
  })
}

export default InfoflowBot;
