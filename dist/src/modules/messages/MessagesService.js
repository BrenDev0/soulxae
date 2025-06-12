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
class MessageService {
    constructor(repository) {
        this.block = "messages.service";
        this.repository = repository;
    }
    create(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedMessage = this.mapToDb(messages);
            try {
                return this.repository.create(mappedMessage);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedMessage);
                throw error;
            }
        });
    }
    resource(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("message_id", messageId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { messageId });
                throw error;
            }
        });
    }
    collection(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("conversation_id", conversationId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "collection", { conversationId });
                throw error;
            }
        });
    }
    // async update(changes: MessageData): Promise<Message> {
    //     const mappedChanges = this.mapToDb(changes);
    //     const cleanedChanges = Object.fromEntries(
    //         Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
    //     );
    //     try {
    //         return await this.repository.update();
    //     } catch (error) {
    //         handleServiceError(error as Error, this.block, "update", cleanedChanges)
    //         throw error;
    //     }
    // }
    // async delete(): Promise<Message> {
    //     try {
    //         return await this.repository.delete() as Message;
    //     } catch (error) {
    //         handleServiceError(error as Error, this.block, "delete")
    //         throw error;
    //     }
    // }
    mapToDb(message) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            conversation_id: message.conversationId,
            sender: message.sender,
            content: message.content,
            type: message.type
        };
    }
    mapFromDb(message) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            messageId: message.message_id,
            conversationId: message.conversation_id,
            sender: message.sender,
            content: message.content,
            type: message.type
        };
    }
}
exports.default = MessageService;
