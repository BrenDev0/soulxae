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
const errors_1 = require("../../core/errors/errors");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
class AgentsController {
    constructor(httpService, agentsService) {
        this.block = "agents.controller";
        this.allowedAgentTypes = ["flow", "direct"];
        this.httpService = httpService;
        this.agentsService = agentsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const requiredFields = ["description", "name", "workspaceId", "agentType"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const { workspaceId, agentType } = req.body;
                this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);
                const workspaceService = Container_1.default.resolve("WorkspacesService");
                const resource = yield workspaceService.resource(workspaceId);
                if (!resource) {
                    throw new errors_1.NotFoundError("No workspce found", {
                        block: `${block}.workspaceExistsCheck`,
                        workspaceId: workspaceId
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        workspaceUserId: resource.userId,
                        userId: user.user_id
                    });
                }
                if (!this.allowedAgentTypes.includes(agentType)) {
                    throw new errors_1.BadRequestError("Invalid agent type", {
                        allowedAgentTypes: this.allowedAgentTypes,
                        type: agentType
                    });
                }
                yield this.agentsService.create(req.body);
                res.status(200).json({ message: "Agent added." });
            }
            catch (error) {
                throw error;
            }
        });
    }
    resourceRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const resource = yield this.agentsService.resource(agentId);
                if (!resource) {
                    throw new errors_1.NotFoundError("Agent not found");
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        workspaceUserId: resource.userId,
                        userId: user.user_id
                    });
                }
                res.status(200).json({ data: resource });
            }
            catch (error) {
                throw error;
            }
        });
    }
    collectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.collectionRequest`;
            try {
                const user = req.user;
                const workspaceId = req.params.workspaceId;
                this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);
                const workspaceService = Container_1.default.resolve("WorkspacesService");
                const resource = yield workspaceService.resource(workspaceId);
                if (!resource) {
                    throw new errors_1.NotFoundError("workspace not found");
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        workspaceUserId: resource.userId,
                        user: user.user_id
                    });
                }
                const data = yield this.agentsService.collection(workspaceId);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.updateRequest`;
            try {
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const resource = yield this.agentsService.resource(agentId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        workspaceUserId: resource.userId,
                        userId: user.user_id
                    });
                }
                const allowedChanges = ["name", "description", "apiKey", "agentType"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                if (filteredChanges.agentType && !this.allowedAgentTypes.includes(filteredChanges.agentType)) {
                    throw new errors_1.BadRequestError("Invalid agent type", {
                        allowedAgentTypes: this.allowedAgentTypes,
                        type: filteredChanges.agentType
                    });
                }
                yield this.agentsService.update(agentId, filteredChanges);
                res.status(200).json({ message: "updated" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteRequest`;
            try {
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const resource = yield this.agentsService.resource(agentId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        workspaceUserId: resource.userId,
                        userId: user.user_id
                    });
                }
                yield this.agentsService.delete(agentId);
                res.status(200).json({ message: "Agent deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AgentsController;
