import { Context, Element, MessageEncoder } from "koishi";
import InfoflowBot from "./bot";
import { SendMessage, mText } from "./type";
import { getBase64 } from './utils';

export class InfoflowMessageEncoder<C extends Context = Context> extends MessageEncoder<C, InfoflowBot<C>> {
  private header: SendMessage['message']['header']
  private body: SendMessage['message']['body']
  async prepare() {
    this.header = {
      toid: +this.channelId,
    }
    this.body = []
  }
  async visit(element: Element): Promise<void> {
    const { type, attrs, children } = element
    if (type === 'text') {
      this.body.push({
        type: 'TEXT',
        content: attrs.content,
      })
    } else if (type === 'at') {
      if (attrs.type === 'all') {
        this.body.push({
          type: 'AT',
          atall: true,
        })
      } else {
        this.body.push({
          type: 'AT',
          atuserids: attrs.id ? [attrs.id] : [],
        })
      }
    } else if (type === 'a') {
      this.body.push({
        type: 'LINK',
        href: attrs.href,
        label: attrs.children ? attrs.children.toString() : attrs.href,
      })
    } else if (type === 'p') {
      if(!(this.body[this.body.length - 1].type === 'TEXT' && (this.body[this.body.length - 1] as mText).content.endsWith('\n')))
        this.body.push({
          type: 'TEXT',
          content: '\n',
        })
      await this.render(children)
      if(!(this.body[this.body.length - 1].type === 'TEXT' && (this.body[this.body.length - 1] as mText).content.endsWith('\n')))
        this.body.push({
          type: 'TEXT',
          content: '\n',
        })
    } else if (type === 'br') {
      this.body.push({
        type: 'TEXT',
        content: '\n',
      })
    } else if (type === 'sharp') {
      // platform does not support sharp
    } else if (type === 'quote') {
      await this.flush()
    } else if (type === 'img' || type === 'image') {
      const res = await this.bot.ctx.http.get(attrs.src, { responseType: 'arraybuffer' })
      const encodeImage = getBase64(res)
      this.body.push({
        type: 'IMAGE',
        content: encodeImage,
      })
    } else if (['video', 'audio', 'file'].includes(type)) {
    } else if (type === 'figure' || type === 'message') {
    } else if (type === 'hr') {
    } else if (type === 'form') {
    } else if (type === 'input') {
    } else if (type === 'button') {
    } else if (type === 'button-group') {
    } else {
      await this.render(children)
    }
  }
}
