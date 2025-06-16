import express, { Request, Response } from 'express';
import HttpService from '../../core/services/HttpService';
import WebhooksService from '../webhooks/WebhooksService';

export default class MessengerController {
    private httpService: HttpService;
    private webhookService: WebhooksService;

    constructor(httpService: HttpService, webhookService: WebhooksService) {
        this.httpService = httpService;
        this.webhookService = webhookService
    }

     async verifyWebhook(req: Request, res: Response): Promise<void> {
        try {
            const challenge = await this.webhookService.verifyWebhook(req, "whatsapp");
           
            console.log('WEBHOOK_VERIFIED')
            res.status(200).send(challenge);
        } catch (error) {
            throw error;
        }
    }

    async handleIncommingMessage(req: Request, res: Response): Promise<void> {
        try {
            await this.webhookService.incomingMessage(req, "whatsapp");
            res.status(200).send()
        } catch (error) {
            throw error;
        }
    }
    
}