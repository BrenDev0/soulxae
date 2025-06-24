import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import Container from "../../core/dependencies/Container";
import WebhooksService from "../webhooks/WebhooksService";
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import WhatsappService from "../whatsapp/WhatsappService";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import { MessageData } from "../messages/messages.interface";
import MessengerService from "../messenger/MessengerService";


export default class DirectMessagagingController {
    private readonly block = "directMessaging.controller"
    private httpService: HttpService;
    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }
    async send(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.send`
        try { 
            const requiredFields = [ "conversationId", "type"];
            this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

            const { conversationId, type } = req.body
            
            const conversationsService = Container.resolve<ConversationsService>("ConversationsService");
           
            const conversation = await conversationsService.getAPIData(conversationId);
            if(!conversation) {
                throw new NotFoundError("conversation not found")
            }

            let productService;
            switch(conversation.platform) {
                case "messenger":
                    productService = Container.resolve<MessengerService>("MessengerService");
                    break;
                case 'whatsapp':
                    productService = Container.resolve<WhatsappService>("WhatsappService");
                    break;
                default:
                    break    
            }

            if(!productService) {
                throw new BadRequestError("Unsupported messaging product")
            }

            const messageRefereceId = await productService.handleOutgoingMessage(req.body, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token);

            const messagesService = Container.resolve<MessagesService>("MessagesService");
            await messagesService.create({
                messageReferenceId: messageRefereceId,
                conversationId: conversation.conversationId!,
                sender: "agent",
                type: type,
                text: req.body.text ? req.body.text : null,
                media: req.body.media ? req.body.media : null,
                mediaType: req.body.mediaType ? req.body.mediaType : null
            })

            res.status(200).json({ message: "Message sent" })
        } catch (error) {
            throw error;
        }
    }  
}