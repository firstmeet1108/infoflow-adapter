import { Internal } from "./internal";

Internal.define({
  '/msg/groupmsgsend': {
    POST: 'sendGroupMessage'
  }
})

declare module './internal' {
  interface Internal {
    /**
     * 发送群消息
     * @see https://qy.baidu.com/doc/index.html#/inner_serverapi/robot?id=%e5%8f%91%e9%80%81%e6%b6%88%e6%81%af-1
     */
    sendGroupMessage(query?: any)
  }
}

// {
//   "agentid": 736,
//   "message": {
//       "header": {
//           "toid": 10526339,
//           "totype": "GROUP",
//           "msgtype": "TEXT",
//           "clientmsgid": 1569398477300,
//           "role": "robot"
//       },
//       "body": [
//           {
//               "type": "TEXT",
//               "content": "Hi~"
//           }
//       ]
//   }
// }
