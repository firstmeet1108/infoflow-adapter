import { Context, Schema, Bot } from 'koishi'
import { HttpServer } from './http';
export class InfoflowBot<C extends Context = Context> extends Bot<C, InfoflowBot.Config> {
  static inject = ['server', 'http'];

  constructor(ctx: C, config: InfoflowBot.Config) {
    super(ctx, config, 'infoflow')
    ctx.plugin(HttpServer, this);
  }
}

export namespace InfoflowBot {
  export interface Config {
    name: string;
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
    selfUrl: Schema.string().default('localhost').description('机器人 URL'),
    port: Schema.number().default(80).description('端口号'),
    token: Schema.string().description('安全令牌'),
    EncodingAESKey: Schema.string().description('消息加解密密钥'),
    path: Schema.string().default('/infoflow').description('路径'),
  })
}

export default InfoflowBot;
