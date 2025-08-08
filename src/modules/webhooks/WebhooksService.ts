import { Request } from "express";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import MessagesService from "../messages/MessagesService";
import ConversationsService from "../conversations/ConversationsService";
import ClientsService from "../clients/ClientsService";
import WhatsappService from "../whatsapp/WhatsappService";
import EncryptionService from "../../core/services/EncryptionService";
import MessengerService from "../messenger/MessengerService";
import { ClientContact } from "../clients/clients.interface";
import axios from "axios";
import { RedisClientType } from "redis";
import WebSocketService from "../webSocket/WebSocketService";
import { AiConfig, AiConfigData } from "../aiConfig/aiConfig.interface";
import AiConfigsService from "../aiConfig/AiConfigService";
import { State } from "./webhooks.interface";

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

            if(platformData.agent_type === "ai" && messageData.text) {
               await this.sendMessageToAi(agentId, conversationId, messagesService, platformData.user_id, messageData.text);
               return
            }

            if(platformData.agent_type === "flow" && messageData.text){
                return
            }

           const webSocketService = Container.resolve<WebSocketService>("WebSocketService");
           webSocketService.broadcast(conversationId, "UPDATE");
           return;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async sendMessageToAi(agentId: string, conversationId: string, messagesService: MessagesService, userId: string, text: string) {
        const block = `webhooks.service.sendToAi`
        try {
             const token = this.httpService.webtokenService.generateToken({userId: userId}, "2m")

            const redisClient = Container.resolve<RedisClientType>("RedisClient");
            const sessionExists = await redisClient.get(`conversation:${conversationId}`);

            if(!sessionExists) {
                const messages = await messagesService.collection(conversationId);
                const chatHistory = messages
                .filter((message) => message.text)
                .sort((a, b) => {
                    const timestampA = new Date(a.timestamp!).getTime();
                    const timestampB = new Date( b.timestamp!).getTime();
                    return timestampB - timestampA;
                })
                .slice(0, 10)
                .map((message) => {
                    return {
                        sender: message.sender,
                        text: message.text!
                    }
                });

                const aiConfigService = Container.resolve<AiConfigsService>("AiConfigService");
                const aiConfig = await aiConfigService.resource(agentId);

                if(!aiConfig) {
                    throw new NotFoundError(`Configuration for agent: ${agentId} not found`, {
                        block: block
                    })
                }

                const sessionData: State = {
                    system_message: aiConfig.systemPrompt,
                    calendar_id: aiConfig.calendarId || null,
                    max_tokens: aiConfig.maxTokens,
                    temperature: aiConfig.temperature,
                    conversation_id: conversationId,
                    user_id: userId,
                    agent_id: agentId,
                    token: token,
                    input: text,
                    chat_history: chatHistory,
                    appointments_state: {
                        name: null,
                        email: null,
                        phone: null,
                        appointment_datetime: null,
                        next_node: null
                    }
                }

                await redisClient.setEx(`conversation:${conversationId}`, 900, JSON.stringify(sessionData));

            } else {
                let currentSession: State = JSON.parse(sessionExists)

                currentSession = {
                    ...currentSession,
                    token: token,
                    input: text
                }

                await redisClient.setEx(`conversation:${conversationId}`, 900, JSON.stringify(currentSession));
            }

           
            
            await axios.post(
                `https://${process.env.AGENT_HOST}/api/agent/interact`,
                {
                    conversation_id: conversationId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return
        } catch (error) {
            throw error
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