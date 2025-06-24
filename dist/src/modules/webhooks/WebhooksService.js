"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const errors_1 = require("../../core/errors/errors");
const axios_1 = __importDefault(require("axios"));
class WebhooksService {
    constructor(httpService, platformsService) {
        this.httpService = httpService;
        this.platformsService = platformsService;
    }
    verifyWebhook(req, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agentId = req.params.id;
                const agentPlatform = yield this.platformsService.getAgentPlatform(agentId, platform);
                // Parse params from the webhook verification request
                let mode = req.query['hub.mode'];
                let token = req.query['hub.verify_token'];
                let challenge = req.query['hub.challenge'];
                // Check if a token and mode were sent
                if (mode && token) {
                    if (!agentPlatform || agentPlatform.webhook_secret === null) {
                        throw new errors_1.BadRequestError("Platform Configuration error", {
                            agentPlatform
                        });
                    }
                    if (mode === 'subscribe' && token === agentPlatform.webhook_secret) {
                        return challenge;
                    }
                    else {
                        throw new errors_1.AuthorizationError();
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    incomingMessage(req, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messagesService = Container_1.default.resolve("MessagesService");
                const agentId = req.params.id;
                const platformData = yield this.platformsService.getAgentPlatform(agentId, platform);
                if (!platformData) {
                    throw new errors_1.BadRequestError("Agent platform configuratin error");
                }
                let productService;
                switch (platform) {
                    case "messenger":
                        productService = Container_1.default.resolve("MessengerService");
                        break;
                    case "whatsapp":
                        productService = Container_1.default.resolve("WhatsappService");
                    default:
                        break;
                }
                if (!productService) {
                    throw new errors_1.BadRequestError("Unsupported messaging product");
                }
                ;
                const clientContact = yield productService.getClientInfo(req, platformData.token);
                const clientId = yield this.handleClient(agentId, clientContact);
                const conversationId = yield this.handleConversaton(clientId, platformData.platform_id);
                const messageData = yield productService.handleIncomingMessage(req, platformData.identifier, platformData.token, conversationId);
                yield messagesService.create(messageData);
                if (platformData.agent_type === "ai" && messageData.text) {
                    const messages = yield messagesService.collection(conversationId);
                    const chatHistory = messages.filter((message) => message.text).map((message) => {
                        return {
                            sender: message.sender,
                            text: message.text
                        };
                    });
                    const redisClient = Container_1.default.resolve("RedisClient");
                    yield redisClient.setEx(`conversation:${conversationId}`, 900, JSON.stringify(chatHistory));
                    const token = this.httpService.webtokenService.generateToken({ userId: platformData.user_id }, "2m");
                    const response = yield axios_1.default.post(`https://${process.env.AGENT_HOST}/api/agent/interact`, {
                        agent_id: agentId,
                        conversation_id: conversationId,
                        input: messageData.text
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                return;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    handleClient(agentId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptionService = Container_1.default.resolve("EncryptionService");
            const clientsService = Container_1.default.resolve("ClientsService");
            const resource = yield clientsService.resource("contact_identifier", encryptionService.encryptData(client.id));
            if (!resource) {
                const newClient = yield clientsService.create({
                    agentId: agentId,
                    name: client.name ? client.name : null,
                    contactIdentifier: client.id
                });
                return newClient.client_id;
            }
            return resource.clientId;
        });
    }
    handleConversaton(clientId, platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversationService = Container_1.default.resolve("ConversationsService");
            const resource = yield conversationService.findByParticipantIds(platformId, clientId);
            if (!resource) {
                const newConversation = yield conversationService.create({
                    clientId: clientId,
                    handoff: false,
                    title: null,
                    platformId: platformId
                });
                return newConversation.conversation_id;
            }
            return resource.conversationId;
        });
    }
}
exports.default = WebhooksService;
