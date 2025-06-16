
import axios from 'axios';
import { MessengerObject, MessengerTemplateElements } from './messenger.interface';
import { ButtonsContent, MessageData, StandarMediaContent, TextContent } from '../messages/messages.interface';
import { BadRequestError, ExternalAPIError } from '../../core/errors/errors';
import { Request } from 'express';
import AppError from '../../core/errors/AppError';

export default class MessengerService {
    private readonly block = "messenger.service";
    async handleOutgoingMessage(message: MessageData, fromId: string, to: string, token: string): Promise<string> {
        try {
            let messageObject: MessengerObject | undefined;

            switch(message.type) {
                case "buttons":
                    messageObject = this.buttonsMessage(message.content as ButtonsContent, to);
                    break;
                case "image":
                    messageObject = this.imageMessage(message.content as StandarMediaContent, to);
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
            const message = req.body.entry[0].messaging[0];
            
            console.log(message, ":::::::::::::::::::::message");
        
            let messageData: MessageData =  {
                messageReferenceId: message.id,
                conversationId: conversationId,
                sender: "client",
                type: "text",
                content: {
                    body: `Unsupported Message type ${message.type}`
                }
            }

            // switch(message.type) {
            //     case "audio":
            //         messageData.type = "audio";
            //         messageData.content = await this.getMediaContent(message.audio, conversationId, token, agentId);
            //         break
            //     case "document":
            //         messageData.type = "document"
            //         messageData.content = await this.getMediaContent(message.document, conversationId, token, agentId);
            //         break
            //     case "image":
            //         messageData.type = "image"
            //         messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
            //         break;
            //     case "text":
            //         messageData.content = {
            //             body: message.text.body
            //         } 
            //         break;
            //     case "video":
            //         messageData.type = "video"
            //         messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
            //         break;
            //     default: 
            //         break;
            // }

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
        console.log(response);
        return response  
        } catch (error) {
            throw new ExternalAPIError(undefined, {
                service: "messenger",
                originalError: (error as Error).message
            })
        }
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
    
    imageMessage(message: StandarMediaContent, to: string): MessengerObject {
 
        let messengerObject: MessengerObject = {
            recipient: {
                id: to
            },
            messaging_type: "RESPONSE",
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: message.url,
                        is_reusable: true
                    }
                }
            }
        }
        return messengerObject;
    }
}
