import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import Container from "../../core/dependencies/Container";
import WebhooksService from "../webhooks/WebhooksService";
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import WhatsappService from "../whatsapp/WhatsappService";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import { MessageData } from "../messages/messages.interface";


export default class DirectMessagagingController {
    private readonly block = "directMessaging.controller"
    private httpService: HttpService;
    private webhookService: WebhooksService;
    constructor(httpService: HttpService, webhookService: WebhooksService) {
        this.httpService = httpService;
        this.webhookService = webhookService
    }

    async verifyWebhook(req: Request, res: Response): Promise<void> {
        try {
            const challenge = await this.webhookService.verifyWebhook(req, "direct");
           
            console.log('WEBHOOK_VERIFIED')
            res.status(200).send(challenge);
        } catch (error) {
            throw error;
        }
    }

    async handleIncommingMessage(req: Request, res: Response): Promise<void> {
        try {
            await this.webhookService.incomingMessage(req, "direct");
            res.status(200).send()
        } catch (error) {
            throw error;
        }
    }

    async send(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.send`
        try { 
            const requiredFields = [ "message"];
            this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

            const message = req.body.message as MessageData;
            
            const requiredMessageFields = ["conversationId", "content"]
            this.httpService.requestValidation.validateRequestBody(requiredMessageFields, message, `${block}.message`);
            
            const conversationsService = Container.resolve<ConversationsService>("ConversationsService");
            const conversation = await conversationsService.getAPIData(message.conversationId);
            if(!conversation) {
                throw new NotFoundError("conversation not found")
            }

            let productService;
            switch(conversation.platform) {
                case 'whatsapp':
                    productService = Container.resolve<WhatsappService>("WhatsappService");
                    break;
                default:
                    break    
            }

            if(!productService) {
                throw new BadRequestError("Unsupported messaging product")
            }

            await productService.handleOutgoingMessage(message.content, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token);

            const messagesService = Container.resolve<MessagesService>("MessagesService");
            await messagesService.create({
                conversationId: conversation.conversationId!,
                type: "agent",
                content: message.content
            })

            res.status(200).json({ message: "Message sent" })
        } catch (error) {
            throw error;
        }
    }  
}