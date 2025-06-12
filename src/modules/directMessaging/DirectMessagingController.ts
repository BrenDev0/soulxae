import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import Container from "../../core/dependencies/Container";
import WebhooksService from "../webhooks/WebhooksService";
import { BadRequestError } from "../../core/errors/errors";
import WhatsappService from "../whatsapp/WhatsappService";
import MessagesService from "../messages/MessagesService";
import { http } from "winston";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";

export default class DirectMessagagingController {
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
            await this.webhookService.incomingMessage(req);
            res.status(200).send()
        } catch (error) {
            throw error;
        }
    }
}