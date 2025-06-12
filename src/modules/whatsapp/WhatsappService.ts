import { ImageObject, InteractiveObject, MessageObject } from '../whatsapp/whatsapp.interface'
import { Content } from '../messages/messages.interface';
import axios from 'axios';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';


export default class WhatsappService {

    async handleIncomingMessage(message: any) {
        try {
            console.log(message) 
            return;
        } catch (error) {
            throw error;
        }
    }
 
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

    async send(messageObject: MessageObject, fromId: string, token: string) {
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