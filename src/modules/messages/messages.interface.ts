export interface Header {
  type: string;
  image: string | null,
  text: string | null,
}

export interface Button {
  type: string;
  reply: {
    id: string;
    title: string;
  }
}

export interface Content {
  header: Header | null;
  body: string;
  footer: string | null;
  buttons: Button[] | null
}

export interface Message {
  message_id?: string;
  conversation_id: string;
  content: Content;
  type: string;
  timeStamp?:  Date 
}

export interface MessageData {
  messageId?: string;
  conversationId: string;
  content: Content;
  type: string;
  timeStamp?:  Date 
}
