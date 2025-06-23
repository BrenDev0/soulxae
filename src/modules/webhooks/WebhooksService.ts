import { Request } from "express";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import { AuthorizationError, BadRequestError, DatabaseError, NotFoundError } from "../../core/errors/errors";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";
import WhatsappService from "../whatsapp/WhatsappService";
import EncryptionService from "../../core/services/EncryptionService";
import AgentsService from "../agents/AgentsService";
import MessengerService from "../messenger/MessengerService";
import { ClientContact } from "../clients/clients.interface";
import axios from "axios";

export default class WebhooksService {
    private httpService: HttpService;
    private platformsService: PlatformsService;

    constructor(httpService: HttpService, platformsService: PlatformsService) {
        this.httpService = httpService;
        this.platformsService = platformsService;
    }

    async verifyWebhook(req: Request, platform: string): Promise<any> {
        try {
            const agentId = req.params.id;
            const agentPlatform = await this.platformsService.getAgentPlatform(agentId, platform)
            
            // Parse params from the webhook verification request
            let mode = req.query['hub.mode']
            let token = req.query['hub.verify_token']
            let challenge = req.query['hub.challenge']
        
            // Check if a token and mode were sent
            if(mode && token) {
                if(!agentPlatform || agentPlatform.webhook_secret === null) {
                    throw new BadRequestError("Platform Configuration error", {
                        agentPlatform
                    })
                }
            
                if(mode === 'subscribe' && token === agentPlatform.webhook_secret) {
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
            const agentId = req.params.id;
            const platformData = await this.platformsService.getAgentPlatform(agentId, platform)
            if(!platformData) {
                throw new BadRequestError("Agent platform configuratin error")
            }
    
            let productService;
        
            switch(platform) {
                case "messenger":
                    productService = Container.resolve<MessengerService>("MessengerService");
                    break;
                case "whatsapp":
                    productService = Container.resolve<WhatsappService>("WhatsappService");
                default:
                    break;
            }

            if(!productService) {
                throw new BadRequestError("Unsupported messaging product");
            };

            const clientContact = await  productService.getClientInfo(req, platformData.token);
            const clientId = await this.handleClient(agentId, clientContact);
            const conversationId = await this.handleConversaton(clientId, platformData.platform_id);
            const messageData = await productService.handleIncomingMessage(req, platformData.identifier, platformData.token, conversationId);
          
            await messagesService.create(messageData)

            if(platformData.type === "ai" && messageData.text) {
                const token = this.httpService.webtokenService.generateToken({userId: platformData.user_id}, "2m")
                const response = await axios.post(
                    `${process.env.AGENT_WEBHOOK}/api/agent/interact`,
                    {
                        agent_id: agentId,
                        conversation_id: conversationId,
                        input: messageData.text
                    },
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    }
                );
            }

           return;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async handleClient(agentId: string, client: ClientContact): Promise<string> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        const clientsService = Container.resolve<ClientsService>("ClientsService");
        

        const resource = await clientsService.resource("contact_identifier", encryptionService.encryptData(client.id));
        if(!resource) {
            const newClient = await clientsService.create({
                agentId: agentId,
                name: client.name ? client.name : null,
                contactIdentifier: client.id
            })

            return newClient.client_id!
        } 

        return resource.clientId!
    }

    async handleConversaton(clientId: string, platformId: string): Promise<string> {
        const conversationService = Container.resolve<ConversationsService>("ConversationsService");

        const resource = await conversationService.findByParticipantIds(platformId, clientId);
    
        if(!resource) {
            const newConversation = await conversationService.create({
                clientId: clientId,
                handoff: false,
                title: null,
                platformId: platformId
            })

            return newConversation.conversation_id!
        }

        return resource.conversationId!
    }
}