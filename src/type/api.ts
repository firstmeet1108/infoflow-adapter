import { Internal } from "./internal";

export interface MessageRequest {
  eventtype: string;
  agentid: number;
  groupid: number;
  corpid: string;
  time: number;
  fromid: number;
  opencode: string;
  message: Message;
}

export interface Message{
  header: {
    fromuserid: string;
    toid: number,
    totype: string;
    msgtype: string;
    clientmsgid: number;
    messageid: number;
    msgseqid: string;
    at: object;
    compatible: string;
    offlinenotify: string;
    extra: string;
    servertime: number;
    clientime: number;
    updatetime: number;
  }
  body: Array<BodyItem>;
}

export interface BodyItem {
  type: 'LINK' | 'TEXT' | 'AT' | 'IMAGE' | 'command';
  robotid?: number;
  name?: string;
  content?: string;
  downloadurl?: string;
  userid?: string;
  label?: string;
  commandname?: string;
}

Internal.define({
  'msg/groupmsgsend': {
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
