import { StandardObject, InteractiveObject, MessageObject, ReadReceipt, WhatsappContact, WhatsappMediaResponse, IncommingWhatsappMedia, } from '../whatsapp/whatsapp.interface'
import { ButtonsContent,  MessageData, StandarMediaContent, TextContent } from '../messages/messages.interface';
import axios from 'axios';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';
import { Request } from 'express';
import Container from '../../core/dependencies/Container';
import AppError from '../../core/errors/AppError';
import S3Service from '../media/S3Service';
import { ClientContact } from '../clients/clients.interface';

export default class WhatsappService {
    private readonly block = "whatsapp.service";
    
    async handleOutgoingMessage(message: MessageData, fromId: string, to: string, token: string): Promise<string> {
        try {
            let messageObject: MessageObject | undefined;

            switch(message.type) {
                case "audio":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "audio");
                    break;
                case "buttons":
                    messageObject = this.buttonsMessage(message.content as ButtonsContent, to);
                    break;
                case "document":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "document");
                    break;
                case "image":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "image");
                    break;
                case "text":
                    messageObject = this.textMessage(message.content as TextContent, to);
                    break;
                case "video":
                    messageObject = this.mediaMessage(message.content as StandarMediaContent, to, "video");
                    break;
                default: 
                    break;

            }

            if(!messageObject) {
                throw new BadRequestError("Unsupported message type");
            }

            const response = await this.send(messageObject, fromId, token);


            if(!response || !response.data.messages || !response.data.messages[0].id) {
                throw new ExternalAPIError();
            }
            return response.data.messages[0].id;
            
        } catch (error) {
            throw error
        }
    }

    async handleIncomingMessage(req: Request, fromId: string, token: string, conversationId: string, agentId: string): Promise<MessageData> {
        try {
            const message = req.body.entry[0].changes[0].value.messages[0];
          
           // console.log(message, ":::::::::::::::::::::message");
            
            
            //message.type !== "unsupported" && await this.sendReadRecipt(message.id, fromId, token);

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
                case "audio":
                    messageData.type = "audio";
                    messageData.content = await this.getMediaContent(message.audio, conversationId, token, agentId);
                    break
                case "document":
                    messageData.type = "document"
                    messageData.content = await this.getMediaContent(message.document, conversationId, token, agentId);
                    break;
                case "image":
                    messageData.type = "image"
                    messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
                    break;
                case "text":
                    messageData.content = {
                        body: message.text.body
                    } 
                    break;
                case "unsupported":
                    break;
                case "video":
                    messageData.type = "video"
                    messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
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

    async getMedia(mediaId: string, token: string, conversarionId: string, agentId: string): Promise<string> {
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
            const key = `${agentId}/${conversarionId}/${contentType}/${mediaId}`

            const mediaService = Container.resolve<S3Service>("S3Service");
            const url = await mediaService.uploadBuffer(key, responseData.data, contentType)
            return url;
        } catch (error) {
            throw error;
        }
    }

    getClientInfo(req: Request): ClientContact {
        const clientInfo = req.body.entry[0]?.changes[0]?.value?.contacts[0];
       
        if(!clientInfo) {
            throw new BadRequestError("Meta data not found");
        }

        return {
            name: clientInfo.profile?.name || null,
            id: clientInfo.wa_id
        }
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

            return response;
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

    mediaMessage(message: StandarMediaContent, to: string, type: string): MessageObject {
        
        const mediaObject: StandardObject = {
            link: message.url as string,
        }

        if(message.caption) {
            mediaObject.caption = message.caption
        }
        const messageObject: MessageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: type,
            [type]: mediaObject
        };

        return messageObject;
    }

    async getMediaContent(message: IncommingWhatsappMedia, conversationId: string, token: string, agentId: string): Promise<StandarMediaContent>{
        const url = await this.getMedia(message.id, token, conversationId, agentId);

        const messageContent: StandarMediaContent = {
            url: url,
            caption: message.caption ? message.caption : null
        }

        return messageContent;
    }
}