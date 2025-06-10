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
class PlatformsController {
    constructor(httpService, platformsService) {
        this.block = "platforms.controller";
        this.httpService = httpService;
        this.platformsService = platformsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const requiredFields = ["agentId", "platform", "token"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const { agentId, platform, token } = req.body;
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let secret = '';
                for (let i = 0; i < 13; i++) {
                    secret += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                const encryptedId = this.httpService.encryptionService.encryptData(agentId);
                const webhookUrl = `https://${process.env.WEBHOOK_URL}/${platform}/${encryptedId}/webhook`;
                const platformData = Object.assign(Object.assign({}, req.body), { webhookUrl: webhookUrl, webhookSecret: secret });
                yield this.platformsService.create(platformData);
                res.status(200).json({ message: "Platform added." });
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
                const platformId = req.params.platformId;
                this.httpService.requestValidation.validateUuid(platformId, "platformId", block);
                const resource = yield this.platformsService.resource("platform_id", platformId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                res.status(200).json({ data: resource });
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
                const platformId = req.params.platformId;
                this.httpService.requestValidation.validateUuid(platformId, "platformId", block);
                const resource = yield this.platformsService.resource("platform_id", platformId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                const allowedChanges = ["token", "platform"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.platformsService.update(platformId, filteredChanges);
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
                const platformId = req.params.platformId;
                this.httpService.requestValidation.validateUuid(platformId, "platformId", block);
                const resource = yield this.platformsService.resource("platform_id", platformId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                yield this.platformsService.delete(platformId);
                res.status(200).json({ message: "Platform deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PlatformsController;
