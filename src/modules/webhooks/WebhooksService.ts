import { Request } from "express";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import { AuthorizationError, BadRequestError } from "../../core/errors/errors";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";
import WhatsappService from "../whatsapp/WhatsappService";

export default class WebhooksService {
    private httpService: HttpService;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    async verifyWebhook(req: Request, platform: string): Promise<any> {
        try {
            const platformsService = Container.resolve<PlatformsService>("PlatformsService");
            const agentId = this.httpService.encryptionService.decryptData(req.params.id)
            const agentPlatform = await platformsService.getAgentPlatform(agentId, platform)
            
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
                    return challenge;
                } else {
                    throw new AuthorizationError();
                }
            }
        } catch (error) {
            throw error;
        }
    }

     async incomingMessage(req: Request): Promise<void> {
        try {
            const agentId = this.httpService.encryptionService.decryptData(req.params.id);
            const messagesService = Container.resolve<MessagesService>("MessagesService");
            const conversationsService = Container.resolve<ConversationsService>("ConversationsService");
            const clientsService = Container.resolve<ClientsService>("ClientsService");
            let platformsService;

            const messagingProduct = req.body.entry[0]?.changes[0]?.value?.messagingProduct;
            if(!messagingProduct) {
                throw new BadRequestError("No product found");
            }

            switch(messagingProduct) {
                case "whatsapp":
                    platformsService = Container.resolve<WhatsappService>("whatsappService");
                default:
                    break;
            }

            if(!platformsService) {
                throw new BadRequestError("Unsuported product");
            };

            const clientMetaData = platformsService.getClientInfo(req);

           console.log("Meta Data::::", clientMetaData);
           return;
        } catch (error) {
            throw error;
        }
    }
}