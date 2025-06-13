import { Request } from "express";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import { AuthorizationError, BadRequestError, DatabaseError, NotFoundError } from "../../core/errors/errors";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";
import WhatsappService from "../whatsapp/WhatsappService";
import { WhatsappContact,  } from "../whatsapp/whatsapp.interface";
import EncryptionService from "../../core/services/EncryptionService";

export default class WebhooksService {
    private httpService: HttpService;
    private platformsService: PlatformsService;

    constructor(httpService: HttpService, platformsService: PlatformsService) {
        this.httpService = httpService;
        this.platformsService = platformsService;
    }

    async verifyWebhook(req: Request, platform: string): Promise<any> {
        try {
            const agentId = this.httpService.encryptionService.decryptData(req.params.id)
            const agentPlatform = await this.platformsService.getAgentPlatform(agentId, platform)
            
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

    async incomingMessage(req: Request, platform: string): Promise<void> {
        try {
            const messagesService = Container.resolve<MessagesService>("MessagesService");
            const agentId = this.httpService.encryptionService.decryptData(req.params.id);
            const platformData = await this.platformsService.getAgentPlatform(agentId, platform);
            if(!platformData) {
                throw new BadRequestError("Agent platform configuratin error")
            }
    
            let productService;

            const messagingProduct = req.body.entry[0]?.changes[0]?.value?.messaging_product;

            if(!messagingProduct) {
                throw new BadRequestError("No product found");
            }

            switch(messagingProduct) {
                case "whatsapp":
                    productService = Container.resolve<WhatsappService>("WhatsappService");
                default:
                    break;
            }

            if(!productService) {
                throw new BadRequestError("Unsupported messaging product");
            };

            const clientContact = productService.getClientInfo(req);
            const clientId = await this.handleClient(agentId, clientContact);
            const conversationId = await this.handleConversaton(agentId, clientId, platform, messagingProduct);
            const messageData = await productService.handleIncomingMessage(req, platformData.identifier, platformData.token, conversationId);
          
            await messagesService.create(messageData)

           return;
        } catch (error) {
            throw error;
        }
    }

    async handleClient(agentId: string, client: WhatsappContact): Promise<string> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        const clientsService = Container.resolve<ClientsService>("ClientsService");
        

        const resource = await clientsService.resource("contact_identifier", encryptionService.encryptData(client.wa_id));
        if(!resource) {
            const newClient = await clientsService.create({
                agentId: agentId,
                name: client.profile.name ? client.profile.name : null,
                contactIdentifier: client.wa_id
            })

            return newClient.client_id!
        } 

        return resource.clientId!
    }

    async handleConversaton(agentId: string, clientId: string, platform: string, messagingProduct: string): Promise<string> {
        const conversationService = Container.resolve<ConversationsService>("ConversationsService");

        const resource = await conversationService.findByParticipantIds(agentId, clientId);
    
        if(!resource) {
            const newConversation = await conversationService.create({
                agentId: agentId,
                messagingProduct: messagingProduct,
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