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
class DirectMessagagingController {
    constructor(httpService) {
        this.block = "directMessaging.controller";
        this.httpService = httpService;
    }
    send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.send`;
            try {
                const requiredFields = ["conversationId", "type"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                console.log(req.body, "REQUEST:::::::::");
                const { conversationId, type } = req.body;
                const conversationsService = Container_1.default.resolve("ConversationsService");
                const conversation = yield conversationsService.getAPIData(conversationId);
                if (!conversation) {
                    throw new errors_1.NotFoundError("conversation not found");
                }
                let productService;
                switch (conversation.platform) {
                    case "messenger":
                        productService = Container_1.default.resolve("MessengerService");
                        break;
                    case 'whatsapp':
                        productService = Container_1.default.resolve("WhatsappService");
                        break;
                    default:
                        break;
                }
                if (!productService) {
                    throw new errors_1.BadRequestError("Unsupported messaging product");
                }
                const messageRefereceId = yield productService.handleOutgoingMessage(req.body, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token);
                const messagesService = Container_1.default.resolve("MessagesService");
                yield messagesService.create({
                    messageReferenceId: messageRefereceId,
                    conversationId: conversation.conversationId,
                    sender: "agent",
                    type: type,
                    text: req.body.text ? req.body.text : null,
                    media: req.body.media ? req.body.media : null,
                    mediaType: req.body.mediaType ? req.body.mediaType : null
                });
                res.status(200).json({ message: "Message sent" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = DirectMessagagingController;
