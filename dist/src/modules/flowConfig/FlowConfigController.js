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
class FlowConfigController {
    constructor(httpService, flowConfigService, agentsService) {
        this.block = "flowConfig.controller";
        this.httpService = httpService;
        this.flowConfigService = flowConfigService;
        this.agentsService = agentsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const requiredFields = ["provider", "apiKey"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.BadRequestError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                if (agentResource.type !== "flow") {
                    throw new errors_1.BadRequestError("Agent type not supported for flow configuration", {
                        agentType: agentResource.type
                    });
                }
                const agentHasConfig = yield this.flowConfigService.resource(agentId);
                if (agentHasConfig) {
                    throw new errors_1.BadRequestError("Agent has already been configured please update previous configuration");
                }
                const flowConfigData = Object.assign(Object.assign({}, req.body), { agentId });
                yield this.flowConfigService.create(flowConfigData);
                res.status(200).json({ message: "FlowConfig added" });
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
                const data = yield this.flowConfigService.resource(agentId);
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
                const configResource = yield this.flowConfigService.resource(agentId);
                if (!configResource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                const allowedChanges = ["apiKey"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.flowConfigService.update(configResource.flowConfigId, filteredChanges);
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
                const configResource = yield this.flowConfigService.resource(agentId);
                if (!configResource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                yield this.flowConfigService.delete(configResource.flowConfigId);
                res.status(200).json({ message: "Flow configuration deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = FlowConfigController;
