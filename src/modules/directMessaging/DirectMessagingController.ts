import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import Container from "../../core/dependencies/Container";
import WebhooksService from "../webhooks/WebhooksService";

export default class DirectMessagagingController {
    private httpService: HttpService;
    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    async verifyWebhook(req: Request, res: Response): Promise<void> {
        try {
            const webhookService = Container.resolve<WebhooksService>("WebhookService");
            const challenge = await webhookService.verifyWebhook(req);
           
            console.log('WEBHOOK_VERIFIED')
            res.status(200).send(challenge);
        } catch (error) {
            throw error;
        }
    }

    async incomingMessage(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body)
        } catch (error) {
            throw error;
        }
    }
}