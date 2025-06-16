import { Header } from "../messages/messages.interface";

export interface ReadReceipt{
  messaging_product: string;
  status: string;
  message_id: string;
}

export interface WhatsappMediaResponse {
  data: {
    messaging_product: string;
    url: string;
    mime_type: string;
    sha256: string;
    file_size: string;
    id: string;
  }
}

export interface WhatsappContact{
  profile: {
    name: string
  };
  wa_id: string;
}

export interface IncommingWhatsappMedia {
  id: string; 
  sha256: string;
  filename: string;
  mime_type: string;
  caption: string;
}

export interface TextObject {
  preview_url: boolean,
  body: string;
}


export interface StandardObject {
  link: string;
  caption?: string; 
}

export interface InteractiveObject {
  type: string;
  header?: Header;
  body: any;
  footer?: {
    text: string;
  };
  action: any;
}

export interface MessageObject {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  interactive?: InteractiveObject;
  image?: StandardObject;
  text?: TextObject;
  audio?: StandardObject;
  document?: StandardObject;
}
