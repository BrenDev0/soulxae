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
const error_service_1 = require("../../core/errors/error.service");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
class ConversationsService {
    constructor(repository) {
        this.block = "conversations.service";
        this.repository = repository;
    }
    create(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedConversation = this.mapToDb(conversation);
            try {
                return this.repository.create(mappedConversation);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedConversation);
                throw error;
            }
        });
    }
    resource(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("conversation_id", conversationId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { conversationId });
                throw error;
            }
        });
    }
    findByParticipantIds(agentId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.findByIds(agentId, clientId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "findByIds", { agentId, clientId });
                throw error;
            }
        });
    }
    getAPIData(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getAPIData(conversationId);
                if (!result) {
                    return null;
                }
                return this.mapForAPI(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { conversationId });
                throw error;
            }
        });
    }
    update(conversationId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("conversation_id", conversationId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("conversation_id", conversationId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { conversationId });
                throw error;
            }
        });
    }
    mapToDb(conversation) {
        console.log("CONVERSATION::::::", conversation);
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: conversation.agentId,
            platform: conversation.platform,
            client_id: conversation.clientId,
            title: conversation.title,
            handoff: conversation.handoff
        };
    }
    mapFromDb(conversation) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agentId: conversation.agent_id,
            platform: conversation.platform,
            clientId: conversation.client_id,
            title: conversation.title,
            handoff: conversation.handoff,
            platformIdentifier: conversation.platform_identifier && encryptionService.decryptData(conversation.platform_identifier),
            clientIdentifier: conversation.client_identifier && encryptionService.decryptData(conversation.client_identifier)
        };
    }
    mapForAPI(conversation) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            conversationId: conversation.conversation_id,
            agentId: conversation.agent_id,
            platform: conversation.platform,
            clientId: conversation.client_id,
            title: conversation.title,
            handoff: conversation.handoff,
            platformIdentifier: encryptionService.decryptData(conversation.platform_identifier),
            clientIdentifier: encryptionService.decryptData(conversation.client_identifier),
            token: encryptionService.decryptData(conversation.token)
        };
    }
}
exports.default = ConversationsService;
