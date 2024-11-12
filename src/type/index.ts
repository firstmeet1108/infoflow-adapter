export * from './internal'
export * from './api'

export interface requestUrlParam{
  signature?: string;
  rn?: string;
  timestamp?: string;
  echostr?: string;
}

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
