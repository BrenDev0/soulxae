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


export interface StandarMediaContent {
  url: string | string[];
  caption: string | null
}

export interface ButtonsContent {
  header: Header | null;
  body: string;
  footer: string | null;
  buttons: Button[]
}

export interface TextContent {
  body: string;
}

export interface Message {
  message_id?: string;
  message_reference_id: string;
  conversation_id: string;
  sender: string;
  type: string;
  content: StandarMediaContent | ButtonsContent | TextContent  ;
  timeStamp?:  Date 
}

export interface MessageData {
  messageId?: string;
  messageReferenceId: string;
  conversationId: string;
  sender: string;
  content: StandarMediaContent | ButtonsContent | TextContent;
  type: string;
  timeStamp?:  Date 
}
