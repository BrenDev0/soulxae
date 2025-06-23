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
class AiConfigsService {
    constructor(repository) {
        this.block = "aiConfig.service";
        this.repository = repository;
    }
    create(aiConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedAiConfig = this.mapToDb(aiConfig);
            try {
                return this.repository.create(mappedAiConfig);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedAiConfig);
                throw error;
            }
        });
    }
    resource(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("agent_id", agentId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { agentId });
                throw error;
            }
        });
    }
    update(aiConfigId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("ai_config_id", aiConfigId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(aiConfigId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("ai_config_id", aiConfigId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { aiConfigId });
                throw error;
            }
        });
    }
    mapToDb(aiConfig) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: aiConfig.agentId,
            system_prompt: aiConfig.systemPrompt,
            max_tokens: aiConfig.maxTokens,
            temperature: aiConfig.temperature
        };
    }
    mapFromDb(aiConfig) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            aiConfigId: aiConfig.agent_id,
            agentId: aiConfig.agent_id,
            systemPrompt: aiConfig.system_prompt,
            maxTokens: aiConfig.max_tokens,
            temperature: aiConfig.temperature
        };
    }
}
exports.default = AiConfigsService;
