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
class AiToolsService {
    constructor(repository) {
        this.block = "aiTools.service";
        this.repository = repository;
    }
    create(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.repository.create(agentId, toolId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", { agentId, toolId });
                throw error;
            }
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.read();
                return result.map((tool) => this.mapFromDb(tool));
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "read ", {});
                throw error;
            }
        });
    }
    resource(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.resource(agentId, toolId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { agentId, toolId });
                throw error;
            }
        });
    }
    collection(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.collection(agentId);
                return result.map((tool) => this.mapFromDb(tool));
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "collection", { agentId });
                throw error;
            }
        });
    }
    delete(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete(agentId, toolId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { agentId, toolId });
                throw error;
            }
        });
    }
    mapToDb(aiTool) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: aiTool.agentId,
            tool_id: aiTool.toolId,
            name: aiTool.name
        };
    }
    mapFromDb(aiTool) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agentId: aiTool.agent_id,
            toolId: aiTool.tool_id,
            name: aiTool.name
        };
    }
}
exports.default = AiToolsService;
