import { Request } from "express";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import { AuthorizationError, BadRequestError, DatabaseError, NotFoundError } from "../../core/errors/errors";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";
import WhatsappService from "../whatsapp/WhatsappService";
import { WhatsappMetaData } from "../whatsapp/whatsapp.interface";
import { cli } from "winston/lib/winston/config";

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
    
            let platformsService;

            const messagingProduct = req.body.entry[0]?.changes[0]?.value?.messaging_product;
            console.log(req.body.entry[0], "entry::::")
            console.log("Changes::::", req.body.entry[0]?.changes[0])
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
                throw new BadRequestError("Unsupported product");
            };

            const clientMetaData = platformsService.getClientInfo(req);
            const clientId = await this.handleClient(agentId, clientMetaData);
            const conversationId = await this.handleConversaton(agentId, clientId, messagingProduct);

          
           return;
        } catch (error) {
            throw error;
        }
    }

    async handleClient(agentId: string, client: WhatsappMetaData): Promise<string> {
        const clientsService = Container.resolve<ClientsService>("ClientsService");
        
        const resource = await clientsService.resource("contact_identifier", client.display_phone_number);
        if(!resource) {
            const newClient = await clientsService.create({
                agentId: agentId,
                name: null,
                contactIdentifier: client.display_phone_number
            })

            return newClient.client_id!
        } 

        return resource.clientId!
    }

    async handleConversaton(agentId: string, clientId: string, platform: string): Promise<string> {
        const conversationService = Container.resolve<ConversationsService>("ConversationsService");

        const resource = await conversationService.findByParticipantIds(agentId, clientId);
        if(!resource) {
            const newConversation = await conversationService.create({
                 agentId: agentId,
                clientId: clientId,
                handoff: false,
                title: null,
                platform: platform
            })

            return newConversation.conversation_id!
        }

        return resource.conversationId!
    }
}