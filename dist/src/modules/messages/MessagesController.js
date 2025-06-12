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
const errors_1 = require("../../core/errors/errors");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
class MessagesController {
    constructor(httpService, messagesService) {
        this.block = "messages.controller";
        this.httpService = httpService;
        this.messagesService = messagesService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const requiredFields = ["message"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const message = req.body.message;
                const conversationService = Container_1.default.resolve("ConversationsService");
                const conversation = yield conversationService.getAPIData(message.conversationId);
                if (!conversation) {
                    throw new errors_1.NotFoundError(undefined, {
                        conversation: conversation || `No conversation found in db with id: ${message.conversationId}`
                    });
                }
                switch (conversation.platform) {
                    case "whatsapp":
                        const whatsappService = Container_1.default.resolve("WhatsappService");
                        yield whatsappService.handleOutgoingMessage(message.content, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token);
                        break;
                    default:
                        throw new errors_1.BadRequestError("Code nfinished messages.controller.createReqquest");
                }
                yield this.messagesService.create(message);
                res.status(200).json({ message: "Message added" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MessagesController;
