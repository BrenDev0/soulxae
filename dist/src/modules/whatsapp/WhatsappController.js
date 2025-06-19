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
class WhatsappController {
    constructor(httpService, webhookService) {
        this.httpService = httpService;
        this.webhookService = webhookService;
    }
    verifyWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const challenge = yield this.webhookService.verifyWebhook(req, "whatsapp");
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            }
            catch (error) {
                throw error;
            }
        });
    }
    handleIncommingMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send();
                yield this.webhookService.incomingMessage(req, "whatsapp");
            }
            catch (error) {
                const errorHandler = Container_1.default.resolve("ErrorHandler");
                errorHandler.handleError(error);
            }
        });
    }
}
exports.default = WhatsappController;
