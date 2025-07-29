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
class ConversationsController {
    constructor(httpService, conversationsService) {
        this.block = "conversations.controller";
        this.httpService = httpService;
        this.conversationsService = conversationsService;
    }
    // async createRequest(req: Request, res: Response): Promise<void> {
    //   const block = `${this.block}.createRequest`;
    //   try {
    //     const requiredFields = [""];
    //     const conversationData = {
    //     };
    //     await this.conversationsService.create(conversationData);
    //     res.status(200).json({ message: " added." });
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    resourceRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const conversationId = req.params.conversationId;
                this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);
                const resource = yield this.conversationsService.resource(conversationId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.conversationExistCheck`,
                        resource: resource || `No conversation found in db with id ${conversationId}`
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
            const block = `${this.block}.resourceRequest`;
            try {
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const data = yield this.conversationsService.collection(agentId);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async updateRequest(req: Request, res: Response): Promise<void> {
    //   const block = `${this.block}.updateRequest`;
    //   try { 
    //    const conversationId = req.params.conversationId;
    //     this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);
    //     const resource = await this.conversationsService.resource(conversationId);
    //     if(!resource) {
    //       throw new NotFoundError(undefined, {
    //         block: `${block}.conversationExistCheck`,
    //         resource: resource || `No conversation found in db with id ${conversationId}`
    //       })
    //     }
    //     const allowedChanges = [""];
    //     const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<ConversationData>(allowedChanges, req.body, block);
    //     await this.conversationsService.update(conversationId, filteredChanges);
    //     res.status(200).json({ message: "updated" });
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    agentHandoff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.agentHandoff`;
            try {
                const user = req.user;
                const conversataionId = req.params.conversationId;
                this.httpService.requestValidation.validateUuid(conversataionId, "conversationId", block);
                function parseBoolean(value) {
                    if (value === 'true')
                        return true;
                    if (value === 'false')
                        return false;
                    return null;
                }
                const agentHandoffStatus = parseBoolean(req.query.status);
                if (agentHandoffStatus === null) {
                    throw new errors_1.BadRequestError("Invalid request query");
                }
                const conversationResource = yield this.conversationsService.resource(conversataionId);
                if (!conversationResource) {
                    throw new errors_1.NotFoundError("Conversation not found");
                }
                yield this.conversationsService.update(conversataionId, { handoff: agentHandoffStatus });
                res.status(200).json({ "message": "conversaiton updated" });
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
                const conversationId = req.params.conversationId;
                this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);
                const resource = yield this.conversationsService.resource(conversationId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.conversationExistCheck`,
                        resource: resource || `No conversation found in db with id ${conversationId}`
                    });
                }
                yield this.conversationsService.delete(conversationId);
                res.status(200).json({ message: "Conversation deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ConversationsController;
