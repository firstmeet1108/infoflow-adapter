import { Dict, HTTP, makeArray } from 'koishi'
import { InfoflowBot } from '../bot'

export interface Internal {}

export interface BaseResponse {
  /** error code. would be 0 if success, and non-0 if failed. */
  code: number
  /** error message. would be 'success' if success. */
  msg: string
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export class Internal {
  constructor(private bot: InfoflowBot) {}

  private processReponse(response: any): BaseResponse {
    const { code, msg } = response
    if (code === 0) {
      return response
    } else {
      this.bot.logger.debug('response: %o', response)
      throw new Error(`HTTP response with non-zero status (${code}) with message "${msg}"`)
    }
  }

  static define(routes: Dict<Partial<Record<Method, string | string[]>>>) {
    for (const path in routes) {
      for (const key in routes[path]) {
        const method = key as Method
        for (const name of makeArray(routes[path][method])) {
          Internal.prototype[name] = async function (this: Internal, ...args: any[]) {
            const raw = args.join(', ')
            const url = path.replace(/\{([^}]+)\}/g, () => {
              if (!args.length) throw new Error(`too few arguments for ${path}, received ${raw}`)
              return args.shift()
            })
            const config: HTTP.RequestConfig = {}
            if (args.length === 1) {
              if (method === 'GET' || method === 'DELETE') {
                config.params = args[0]
              } else {
                config.data = args[0]
              }
            } else if (args.length === 2 && method !== 'GET' && method !== 'DELETE') {
              config.data = args[0]
              config.params = args[1]
            } else if (args.length > 1) {
              throw new Error(`too many arguments for ${path}, received ${raw}`)
            }
            return this.processReponse((await this.bot.http(method, url, config)).data)
          }
        }
      }
    }
  }
}
