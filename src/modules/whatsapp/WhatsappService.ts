import { ImageObject, InteractiveObject, MessageObject, ReadReceipt, WhatsappMetaData } from '../whatsapp/whatsapp.interface'
import { Content } from '../messages/messages.interface';
import axios from 'axios';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';
import { Request } from 'express';
import { Conversation, ConversationData } from '../conversations/conversations.interface';
import Container from '../../core/dependencies/Container';
import ConversationsService from '../conversations/ConversationsService';


export default class WhatsappService {
    async handleOutgoingMessage(message: Content, fromId: string, to: string, token: string): Promise<void> {
        try {
            let messageObject: MessageObject;

            if(message.buttons) {
                messageObject = this.buttonsMessage(message, to);
            } else if(message.header) {
                messageObject = this.imageMessage(message, to);
            } else {
                messageObject = this.textMessage(message, to)
            }

            if(!messageObject) {
                throw new BadRequestError();
            }

            await this.send(messageObject, fromId, token)
            
        } catch (error) {
            throw error
        }
    }

    async getMessageContent(req: Request, fromId: string, token: string) {
        try {
            const message = req.body.entry[0].changes[0].value.messages[0];
            
            await this.sendReadRecipt(message.id, fromId, token);

            console.log(message);
            return;
        } catch (error) {
            throw error;
        }
    }

    getClientInfo(req: Request): WhatsappMetaData {
        const clientInfo = req.body.entry[0]?.changes[0]?.value?.metaData;
        console.log(req.body.entry[0]?.changes[0]?.value?.contacts[0], "contacts::::::::::")
        if(!clientInfo) {
            throw new BadRequestError("Meta data not found");
        }

        return clientInfo;
    }

    async sendReadRecipt(messageId: string, fromId: string, token: string): Promise<void> {
        try {
            const readReceipt: ReadReceipt = {
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId
            }

            await this.send(readReceipt, fromId, token);
            return;
        } catch (error) {
            throw error;
        }
    }

    async send(messageObject: MessageObject | ReadReceipt, fromId: string, token: string) {
        try {
        await axios.post(
            `https://graph.facebook.com/${process.env.WHATSAPP_VID}/${fromId}/messages`,
            messageObject,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
            console.log("message sent");
            return;
        } catch (error) {
        throw new ExternalAPIError(undefined, {
            service: "whatsapp",
            originalError: (error as Error).message
        })
        }
    }

    textMessage(message: Content, to: string): MessageObject  {
        const messageObject: MessageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: {
                preview_url: true,
                body: message.body
            }
        } 
        
        return messageObject;
    }

    buttonsMessage(message: Content, to: string): MessageObject {
        const interactiveObject: InteractiveObject = {
            type: "button",
            body: {
                text: message.body,
            },
            action: {
                buttons: message.buttons,
            },
        };

        if(message.header) {
            interactiveObject.header = message.header;
        }

        if(message.footer) {
            interactiveObject.footer = { text: message.footer };
        }

        const messageObject: MessageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: interactiveObject,
        };

        return messageObject;
    }

    imageMessage(message: Content, to: string): MessageObject {
        let imageObjcet: ImageObject =  {
            link: message.header.image!
        }

        if(message.body) {
            imageObjcet.caption = message.body;
        }

        const messageObject: MessageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "image",
            image: imageObjcet
        };

        return messageObject;
    }
}