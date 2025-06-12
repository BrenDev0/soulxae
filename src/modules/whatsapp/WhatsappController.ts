import express, { Request, Response } from 'express';
import Container from '../../core/dependencies/Container';
import PlatformsService from '../platforms/PlatformsService';
import HttpService from '../../core/services/HttpService';
import { AuthorizationError, BadRequestError } from '../../core/errors/errors';

export default class WhatsappController {
    private httpService: HttpService;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }
    async verifyWebhook(req: Request, res: Response): Promise<any> {
        try {
            const platformsService = Container.resolve<PlatformsService>("PlatformsService");
            const agentId = this.httpService.encryptionService.decryptData(req.params.id)
            const agentPlatform = await platformsService.getAgentPlatform(agentId, 'whatsapp')
            
            // Parse params from the webhook verification request
            let mode = req.query['hub.mode']
            let token = req.query['hub.verify_token']
            let challenge = req.query['hub.challenge']
        
            // Check if a token and mode were sent
            if(mode && token) {
                if(!agentPlatform || agentPlatform.webhookSecret === null) {
                    throw new BadRequestError("Platform Configuration error", {
                        agentPlatform
                    })
                }
            
                if(mode === 'subscribe' && token === agentPlatform.webhookSecret) {
                    // Respond with 200 OK and challenge token from the request
                    console.log('WEBHOOK_VERIFIED')
                    res.status(200).send(challenge);
                    return;
                } else {
                    throw new AuthorizationError();
                }
            }
        } catch (error) {
            throw error;
        }
    }
}