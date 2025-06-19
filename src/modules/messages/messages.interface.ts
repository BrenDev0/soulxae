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

export interface ButtonsContent {
  header: Header | null;
  body: string;
  footer: string | null;
  buttons: Button[]
}

export interface Message {
  message_id?: string;
  message_reference_id: string;
  conversation_id: string;
  sender: string;
  type: string;
  text: string | null;
  media: string[] | null;
  media_type: string | null;
  timeStamp?:  Date 
}

export interface MessageData {
  messageId?: string;
  messageReferenceId: string;
  conversationId: string;
  sender: string;
  text: string | null;
  media: string[] | null;
  mediaType: string | null;
  type: string;
  timeStamp?:  Date 
}
