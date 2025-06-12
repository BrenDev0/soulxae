import { Header } from "../messages/messages.interface";

export interface Whatsapp {
  // Define your database interface fields here
}

export interface WhatsappData {
  // Define your data interface fields here
}

export interface TextObject {
  preview_url: boolean,
  body: string;
}

export interface ImageObject {
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
  image?: ImageObject;
  text?: TextObject 
}
