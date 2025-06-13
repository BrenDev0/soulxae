import { ImageObject, InteractiveObject, MessageObject, ReadReceipt, WhatsappContact, WhatsappImage, WhatsappMediaResponse } from '../whatsapp/whatsapp.interface'
import { ButtonsContent, ImageContent, Message, MessageData, TextContent } from '../messages/messages.interface';
import axios from 'axios';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';
import { Request } from 'express';
import { Conversation, ConversationData } from '../conversations/conversations.interface';
import Container from '../../core/dependencies/Container';
import ConversationsService from '../conversations/ConversationsService';
import AppError from '../../core/errors/AppError';
import S3Service from '../media/S3Service';


export default class WhatsappService {
    private readonly block = "whatsapp.service";
    
    async handleOutgoingMessage(message: MessageData, fromId: string, to: string, token: string): Promise<string> {
        try {
            let messageObject: MessageObject | undefined;

            switch(message.type) {
                case "image":
                    messageObject = this.imageMessage(message.content as ImageContent, to);
                    break;
                case "buttons":
                    messageObject = this.buttonsMessage(message.content as ButtonsContent, to);
                    break;
                case "text":
                    messageObject = this.textMessage(message.content as TextContent, to);
                    break;
                default: 
                    break;

            }

            if(!messageObject) {
                throw new BadRequestError();
            }

            const response = await this.send(messageObject, fromId, token);

            if(!response || !response.messages || !response.messages[0].id) {
                throw new ExternalAPIError();
            }
            return response.messages[0].id;
            
        } catch (error) {
            throw error
        }
    }

    async handleIncomingMessage(req: Request, fromId: string, token: string, conversationId: string): Promise<MessageData> {
        try {
            const message = req.body.entry[0].changes[0].value.messages[0];
            console.log(message, ":::::::::::::::::::::message");
            
            
            await this.sendReadRecipt(message.id, fromId, token);

            let messageData: MessageData =  {
                messageReferenceId: message.id,
                conversationId: conversationId,
                sender: "client",
                type: "text",
                content: {
                    body: `Unsupported Message type ${message.type}`
                }
            }

            switch(message.type) {
                case "image":
                    messageData.content = await this.getImageMessageContent(message.image, conversationId, token)
                    break;
                case "text":
                    messageData.content = {
                        body: message.text.body
                    } 
                    break;
                default: 
                    break;
            }

            return messageData;
        } catch (error) {
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

    async getMedia(mediaId: string, token: string, conversarionId: string): Promise<string> {
        try {
            const responseUrl: WhatsappMediaResponse = await axios.get(
                `https://graph.facebook.com/v23.0/${mediaId}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );

            if(!responseUrl) {
                throw new ExternalAPIError();
            }

            const responseData = await axios.get(
                `${responseUrl.data.url}/${mediaId}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                    responseType: 'arraybuffer'
                }
            );
            const contentType = responseData.headers['content-type']
            const key = `${conversarionId}/${contentType}/${mediaId}`

            const mediaService = Container.resolve<S3Service>("S3Service");
            const url = await mediaService.uploadBuffer(key, responseData.data, contentType)
            return url;
        } catch (error) {
            throw error;
        }
    }

    getClientInfo(req: Request): WhatsappContact {
        const clientInfo = req.body.entry[0]?.changes[0]?.value?.contacts[0];
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
            const response = await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_VID}/${fromId}/messages`,
                messageObject,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
                
            return response.data;
        } catch (error) {
            throw new ExternalAPIError(undefined, {
                service: "whatsapp",
                originalError: (error as Error).message
            })
        }
    }

    textMessage(message: TextContent, to: string): MessageObject  {
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

    buttonsMessage(message: ButtonsContent, to: string): MessageObject {
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

    imageMessage(message: ImageContent, to: string): MessageObject {
        let imageObjcet: ImageObject =  {
            link: message.url
        }

        if(message.caption) {
            imageObjcet.caption = message.caption;
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

    async getImageMessageContent(message: WhatsappImage, conversationId: string, token: string): Promise<ImageContent> {
        const url = await this.getMedia(message.id, token, conversationId);
        const messageContent: ImageContent = {
            url: url,
            caption: message.caption ? message.caption : null
        } 
             
        return messageContent    
    }
}