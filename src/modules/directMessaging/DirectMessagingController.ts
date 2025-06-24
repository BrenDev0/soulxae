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
import { DirectMessagagingService } from "./DirectMessagingService";


export default class DirectMessagagingController {
    private readonly block = "directMessaging.controller"
    private httpService: HttpService;
    private directMessagingService: DirectMessagagingService;
    constructor(httpService: HttpService, directMessagingService: DirectMessagagingService) {
        this.httpService = httpService;
        this.directMessagingService = directMessagingService;
    }
    async send(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.send`
        try { 
            const requiredFields = [ "conversationId", "type"];
            this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
            
            await this.directMessagingService.handleOutGoingMessage(req.body)

            res.status(200).json({ message: "Message sent" })
        } catch (error) {
            throw error;
        }
    }  
}