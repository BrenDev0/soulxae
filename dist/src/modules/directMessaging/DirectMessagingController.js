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
class DirectMessagagingController {
    constructor(httpService, directMessagingService) {
        this.block = "directMessaging.controller";
        this.httpService = httpService;
        this.directMessagingService = directMessagingService;
    }
    send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.send`;
            try {
                const requiredFields = ["conversationId", "type"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                yield this.directMessagingService.handleOutGoingMessage(req.body);
                res.status(200).json({ message: "Message sent" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = DirectMessagagingController;
