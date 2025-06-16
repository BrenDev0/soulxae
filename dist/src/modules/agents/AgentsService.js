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
class AgentsService {
    constructor(repository) {
        this.block = "agents.service";
        this.repository = repository;
    }
    create(agents) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedAgent = this.mapToDb(agents);
            try {
                return this.repository.create(mappedAgent);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedAgent);
                throw error;
            }
        });
    }
    resource(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.resource(agentId);
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
    collection(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.collection(workspaceId);
                const data = result.map((agent) => this.mapFromDb(agent));
                return data;
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { workspaceId });
                throw error;
            }
        });
    }
    update(agentId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("agent_id", agentId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("agent_id", agentId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { agentId });
                throw error;
            }
        });
    }
    mapToDb(agent) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_type: agent.agentType.toLowerCase(),
            workspace_id: agent.workspaceId,
            api_key: agent.apiKey && encryptionService.encryptData(agent.apiKey),
            name: agent.name,
            description: agent.description
        };
    }
    mapFromDb(agent) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agentId: agent.agent_id,
            agentType: agent.agent_type.toLowerCase(),
            workspaceId: agent.workspace_id,
            apiKey: agent.api_key === null ? null : encryptionService.decryptData(agent.api_key),
            name: agent.name,
            description: agent.description,
            userId: agent.user_id
        };
    }
}
exports.default = AgentsService;
