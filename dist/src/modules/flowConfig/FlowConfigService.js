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
class FlowConfigsService {
    constructor(repository) {
        this.block = "flowConfig.service";
        this.repository = repository;
    }
    create(flowConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedFlowConfig = this.mapToDb(flowConfig);
            try {
                return this.repository.create(mappedFlowConfig);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedFlowConfig);
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
    update(flowConfigId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("flowConfig_id", flowConfigId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(flowConfigId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("flowConfig_id", flowConfigId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { flowConfigId });
                throw error;
            }
        });
    }
    mapToDb(flowConfig) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: flowConfig.agentId,
            provider: flowConfig.provider,
            api_key: flowConfig.apiKey && encryptionService.encryptData(flowConfig.apiKey)
        };
    }
    mapFromDb(flowConfig) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            flowConfigId: flowConfig.flow_config_id,
            agentId: flowConfig.agent_id,
            provider: flowConfig.provider,
            apiKey: encryptionService.decryptData(flowConfig.api_key)
        };
    }
}
exports.default = FlowConfigsService;
