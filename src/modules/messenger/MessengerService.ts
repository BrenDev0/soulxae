
import axios from 'axios';
import { IncommingMessengerAttachment, MessengerObject, MessengerTemplateElements, TemplatePayload } from './messenger.interface';
import { ButtonsContent, MessageData, StandarMediaContent, TextContent } from '../messages/messages.interface';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';
import { Request } from 'express';
import AppError from '../../core/errors/AppError';
import { ClientContact } from '../clients/clients.interface';

export default class MessengerService {
    private readonly block = "messenger.service";

    async handleOutgoingMessage(message: MessageData, fromId: string, to: string, token: string): Promise<string> {
        try {
            let messageObject: MessengerObject | undefined;

            switch(message.type) {
                case "audio":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "audio");
                    break;
                case "buttons":
                    messageObject = this.buttonsMessage(message.content as ButtonsContent, to);
                    break;
                case "document":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "files");
                    break;
                case "image":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "image");
                    break;
                case "text":
                    messageObject = this.textMessage(message.content as TextContent, to);
                    break;
                default: 
                    break;

            }

            if(!messageObject) {
                throw new BadRequestError("Unsupported message type");
            }

            const response = await this.send(messageObject, fromId, token);

            if(!response.data || !response.data.message_id) {
                throw new ExternalAPIError()
            }
           
            return response.data.message_id;
            
        } catch (error) {
            throw error
        }
    }

    async handleIncomingMessage(req: Request, fromId: string, token: string, conversationId: string, agentId: string): Promise<MessageData> {
        try {
            const message = req.body.entry[0].messaging[0].message;

            console.log(message, ":::::::::::::::::::::message");

            let messageData: MessageData =  {
                messageReferenceId: message.mid,
                conversationId: conversationId,
                sender: "client",
                type: "text",
                content: {
                    body: `Unsupported Message type`
                }
            }

            if(message.text) {
            messageData.content = {
                body: message.text
            }
            } else if(message.attachments) {
                messageData.type =  message.attachments[0].type;
                messageData.content = this.getMediaContent(message.attachments);
            }

            return messageData;
        } catch (error) {
            console.log(error, ":::::::::error")
            if(error instanceof AppError) {
                throw error;
            }

            throw new ExternalAPIError(undefined, {
                service: "whatsapp",
                block: `${this.block}.getMessageContent`,
                originalError: (error as Error).message
            })
        }
    }

    async send(messageObject: any, fromId: string, token: string) {
        try {
        
        const response = await axios.post(
            `https://graph.facebook.com/${process.env.MESSENGER_VERSION}/${fromId}/messages?access_token=${token}`,
            messageObject
        );   

        console.log(response.data)
   
        return response  
        } catch (error) {
            throw new ExternalAPIError(undefined, {
                service: "messenger",
                originalError: (error as Error).message
            })
        }
    }

    async getClientInfo(req: Request, token: string): Promise<ClientContact> {
        const message = req.body.entry[0].messaging[0].message;
        const response = await axios.get(`https://graph.facebook.com/${process.env.MESSENGER_VERSION}/${message.mid}?fields=id,created_time,from,to,message&access_token=${token}`);
    
        if(!response) {
            throw new BadRequestError("Meta data not found");
        }

        return {
            name: response.data.from.name || null,
            id: response.data.from.id
        };
    }

    textMessage(message: TextContent, to: string): MessengerObject {
        const messengerObject = {
            recipient:{
                id: to
            },
            messaging_type: "RESPONSE",
            message: {
                text: message.body
            }
        }

        return messengerObject;
    }

    buttonsMessage(message: ButtonsContent, to: string): MessengerObject {
        let elements: MessengerTemplateElements =  {
            subtitle: "Unsuported message type",
            buttons: []
        }

        if(message.header) {
            switch(message.header.type) {
                case "image":
                    elements.image_url = message.header.image!;
                    break;
                case "text":
                    elements.title = message.header.text!;
                    break;
                default:
                    break
            }
        }

        if(message.body) {
            elements.subtitle = message.body
        }

        if(message.buttons) {
            elements.buttons = message.buttons.map((button) => {
                return {
                    type: "postback",
                    title: button.reply.title,
                    payload: button.reply.id
                }
            })
        }


        let messengerObject: MessengerObject = {
        recipient: {
            id: to
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
        } 

        return messengerObject;
    }
    
    mediaMessage(message: StandarMediaContent, to: string, type: string): MessengerObject {

        const attachments = message.urls.map((url) => {
            return {
                type: type,
                payload: {
                    url: url,
                    is_reusable: true
                }
            }
        })
 
        let messengerObject: MessengerObject = {
            recipient: {
                id: to
            },
            messaging_type: "RESPONSE",
            message: {
                attachment: attachments
            }
        }
        return messengerObject;
    }

    getMediaContent(message: IncommingMessengerAttachment[]): StandarMediaContent {
        const urls = message.map((attachment: IncommingMessengerAttachment) => attachment.payload.url)
        const mediaContent: StandarMediaContent = {
            urls: urls,
            caption: null
        }

        return mediaContent
    }
}
