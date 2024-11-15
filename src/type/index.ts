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
  message: ReceiveMessage;
}

export type mText = {
  type: 'TEXT';
  content: string;
}

type mLink = {
  type: 'LINK';
  href: string;
  label?: string;
}

type mAtall = {
  type: 'AT';
  atall: boolean;
}

type mAt = {
  type: 'AT';
  atuserids: Array<string>;
}

type mImage = {
  type: 'IMAGE';
  content: string;
}

type mMd = {
  type: 'MD';
  content: string;
}

export type m = mText | mLink | mAtall | mAt | mImage | mMd

export interface ReceiveMessage{
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
  body: Array<m>;
}

// export interface m {
//   type: mType;
//   robotid?: number;
//   name?: string;
//   content?: string;
//   downloadurl?: string;
//   userid?: string;
//   label?: string;
//   commandname?: string;
//   atall?: boolean;
// }


export interface SendMessage {
  message: {
    header: {
      toid: number | Array<number>;
    };
    body: Array<m>;
  };
}

// {
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
