export interface Header {
  type: string;
  image?: string | null,
  text?: string | null,
}

export interface Button {
  type: string;
  reply: {
    id: string;
    title: string;
  }
}

export interface ImageContent {
  url: string;
  caption: string
}

export interface ButtonsContent {
  header: Header | null;
  body: string;
  footer: string | null;
  buttons: Button[] | null
}

export interface TextContent {
  body: string;
}

export interface Message {
  message_id?: string;
  conversation_id: string;
  sender: string;
  type: string;
  content: ImageContent | ButtonsContent | TextContent;
  timeStamp?:  Date 
}

export interface MessageData {
  messageId?: string;
  conversationId: string;
  sender: string;
  content: ImageContent | ButtonsContent | TextContent;
  type: string;
  timeStamp?:  Date 
}
