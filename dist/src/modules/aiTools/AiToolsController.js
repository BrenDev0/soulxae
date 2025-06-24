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
class AiToolsController {
    constructor(httpService, aiToolsService, agentsService) {
        this.block = "aiTools.controller";
        this.httpService = httpService;
        this.aiToolsService = aiToolsService;
        this.agentsService = agentsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const requiredFields = ["agentId", "toolId"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const { agentId, toolId } = req.body;
                const [agentResource, tools] = yield Promise.all([
                    this.agentsService.resource(agentId),
                    this.aiToolsService.read()
                ]);
                if (!tools.find((tool) => tool.toolId === toolId)) {
                    throw new errors_1.NotFoundError("Tool not found");
                }
                if (!agentResource) {
                    throw new errors_1.NotFoundError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                if (agentResource.type !== "ai") {
                    throw new errors_1.BadRequestError("Agent type not compatible with tools", {
                        agentType: agentResource.type,
                        allowedTypes: "ai"
                    });
                }
                yield this.aiToolsService.create(agentId, toolId);
                res.status(200).json({ message: "AiTool added to agent config" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                if (req.query.resource) {
                    const toolId = req.query.resource;
                    this.httpService.requestValidation.validateUuid(toolId, "toolId", block);
                    const data = yield this.aiToolsService.resource(agentId, toolId);
                    res.status(200).json({ data: data });
                    return;
                }
                const data = yield this.aiToolsService.collection(agentId);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    readRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.aiToolsService.read();
                res.status(200).json({ data: data });
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
                const requiredFields = ["agentId", "toolId"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const { agentId, toolId } = req.body;
                const agentResource = yield this.agentsService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.NotFoundError("Agent not found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                yield this.aiToolsService.delete(agentId, toolId);
                res.status(200).json({ message: "Tool removed from aget config" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AiToolsController;
