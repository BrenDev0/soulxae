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
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../core/errors/errors");
class AgentsController {
    constructor(httpService, agentsService) {
        this.block = "agents.controller";
        this.allowedAgentTypes = ["flow", "ai"];
        this.httpService = httpService;
        this.agentsService = agentsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const requiredFields = ["type", "name", "description"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const { type } = req.body;
                if (!this.allowedAgentTypes.includes(type)) {
                    throw new errors_1.BadRequestError("Unsupported agent type", {
                        allowedTypes: this.allowedAgentTypes,
                        request: type
                    });
                }
                const agentData = Object.assign(Object.assign({}, req.body), { userId: user.user_id });
                yield this.agentsService.create(agentData);
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
                const agentResource = yield this.httpService.requestValidation.validateResource(agentId, "AgentsService", "Agent not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block);
                res.status(200).json({ data: agentResource });
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
                const data = yield this.agentsService.collection(user.user_id);
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
                const agentResource = yield this.httpService.requestValidation.validateResource(agentId, "AgentsService", "Agent not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block);
                const allowedChanges = ["name", "description"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.agentsService.update(agentId, filteredChanges);
                res.status(200).json({ message: "Agent updated" });
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
                const agentResource = yield this.httpService.requestValidation.validateResource(agentId, "AgentsService", "Agent not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block);
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
