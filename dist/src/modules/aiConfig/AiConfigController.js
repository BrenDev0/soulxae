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
class AiConfigController {
    constructor(httpService, aiConfigService, agentsService) {
        this.block = "aiConfig.controller";
        this.httpService = httpService;
        this.aiConfigService = aiConfigService;
        this.agentsService = agentsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const requiredFields = ["systemPrompt", "maxTokens", "temperature"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.BadRequestError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                const agentHasConfig = yield this.aiConfigService.resource(agentId);
                if (agentHasConfig) {
                    throw new errors_1.BadRequestError("Agent has already been configured please update previous configuration");
                }
                const aiConfigData = Object.assign(Object.assign({}, req.body), { agentId: agentId });
                yield this.aiConfigService.create(aiConfigData);
                res.status(200).json({ message: "AiConfig added" });
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
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const user = req.user;
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.BadRequestError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                const data = yield this.aiConfigService.resource(agentId);
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
                const agentId = req.params.agetnId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const user = req.user;
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.BadRequestError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                const configResource = yield this.aiConfigService.resource(agentId);
                if (!configResource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                const allowedChanges = ["systemPrompt", "maxTokens", "temperature"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.aiConfigService.update(configResource.aiConfigId, filteredChanges);
                res.status(200).json({ message: "AiConfig updated" });
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
                const agentId = req.params.agetnId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const user = req.user;
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.BadRequestError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                const configResource = yield this.aiConfigService.resource(agentId);
                if (!configResource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                yield this.aiConfigService.delete(configResource.aiConfigId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AiConfigController;
