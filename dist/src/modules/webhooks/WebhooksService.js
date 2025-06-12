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
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const errors_1 = require("../../core/errors/errors");
class WebhooksService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    verifyWebhook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platformsService = Container_1.default.resolve("PlatformsService");
                const agentId = this.httpService.encryptionService.decryptData(req.params.id);
                const agentPlatform = yield platformsService.getAgentPlatform(agentId, 'whatsapp');
                // Parse params from the webhook verification request
                let mode = req.query['hub.mode'];
                let token = req.query['hub.verify_token'];
                let challenge = req.query['hub.challenge'];
                // Check if a token and mode were sent
                if (mode && token) {
                    if (!agentPlatform || agentPlatform.webhookSecret === null) {
                        throw new errors_1.BadRequestError("Platform Configuration error", {
                            agentPlatform
                        });
                    }
                    if (mode === 'subscribe' && token === agentPlatform.webhookSecret) {
                        return challenge;
                    }
                    else {
                        throw new errors_1.AuthorizationError();
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = WebhooksService;
