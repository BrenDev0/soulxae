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
class MessengerController {
    constructor(httpService, webhookService) {
        this.httpService = httpService;
        this.webhookService = webhookService;
    }
    verifyWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const challenge = yield this.webhookService.verifyWebhook(req, "messenger");
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
                yield this.webhookService.incomingMessage(req, "messenger");
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MessengerController;
