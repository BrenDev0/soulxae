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
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../../core/errors/errors");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const AppError_1 = __importDefault(require("../../core/errors/AppError"));
class WhatsappService {
    constructor() {
        this.block = "whatsapp.service";
    }
    handleOutgoingMessage(message, fromId, to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let messageObject;
                switch (message.type) {
                    case "audio":
                        messageObject = this.mediaMessage(message, to, "audio");
                        break;
                    case "document":
                        messageObject = this.mediaMessage(message, to, "document");
                        break;
                    case "image":
                        messageObject = this.mediaMessage(message, to, "image");
                        break;
                    case "text":
                        messageObject = this.textMessage(message, to);
                        break;
                    case "video":
                        messageObject = this.mediaMessage(message, to, "video");
                        break;
                    default:
                        break;
                }
                if (!messageObject) {
                    throw new errors_1.BadRequestError("Unsupported message type");
                }
                const response = yield this.send(messageObject, fromId, token);
                if (!response || !response.data.messages || !response.data.messages[0].id) {
                    throw new errors_1.ExternalAPIError();
                }
                return response.data.messages[0].id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    handleIncomingMessage(req, fromId, token, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const message = (_c = (_b = (_a = req.body.entry[0]) === null || _a === void 0 ? void 0 : _a.changes[0]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.messages[0];
                if (!message) {
                    throw new errors_1.BadRequestError(undefined, {
                        req: req.body
                    });
                }
                console.log(message, ":::::::::::::::::::::message");
                message.type !== "unsupported" && (yield this.sendReadRecipt(message.id, fromId, token));
                let messageData = {
                    messageReferenceId: message.id,
                    conversationId: conversationId,
                    sender: "client",
                    type: "text",
                    text: null,
                    media: null,
                    mediaType: null
                };
                switch (message.type) {
                    case "audio":
                        messageData.type = "audio";
                        messageData.mediaType = message.audio.mime_type;
                        message.image.caption && (messageData.text = message.audio.caption);
                        messageData.media = yield this.getMediaContent(message.audio, conversationId, token);
                        break;
                    case "document":
                        messageData.type = "document";
                        messageData.mediaType = message.document.mime_type;
                        message.image.caption && (messageData.text = message.document.caption);
                        messageData.media = yield this.getMediaContent(message.document, conversationId, token);
                        break;
                    case "image":
                        messageData.type = "image";
                        messageData.mediaType = message.image.mime_type;
                        message.image.caption && (messageData.text = message.image.caption);
                        messageData.media = yield this.getMediaContent(message.image, conversationId, token);
                        break;
                    case "text":
                        messageData.text = message.text.body;
                        break;
                    case "unsupported":
                        messageData.text = "Unsupported message type";
                        break;
                    case "video":
                        messageData.type = "video";
                        messageData.mediaType = message.video.mime_type;
                        message.image.caption && (messageData.text = message.video.caption);
                        messageData.media = yield this.getMediaContent(message.image, conversationId, token);
                        break;
                    default:
                        break;
                }
                return messageData;
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    throw error;
                }
                throw new errors_1.ExternalAPIError(undefined, {
                    service: "whatsapp",
                    block: `${this.block}.getMessageContent`,
                    originalError: error.message
                });
            }
        });
    }
    getMedia(mediaId, token, conversarionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUrl = yield axios_1.default.get(`https://graph.facebook.com/v23.0/${mediaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!responseUrl) {
                    throw new errors_1.ExternalAPIError();
                }
                const responseData = yield axios_1.default.get(`${responseUrl.data.url}/${mediaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'arraybuffer'
                });
                const contentType = responseData.headers['content-type'];
                const mediaService = Container_1.default.resolve("S3Service");
                const url = yield mediaService.uploadBuffer(conversarionId, mediaId, responseData.data, contentType);
                return url;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getClientInfo(req) {
        var _a, _b, _c, _d;
        const clientInfo = (_c = (_b = (_a = req.body.entry[0]) === null || _a === void 0 ? void 0 : _a.changes[0]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.contacts[0];
        if (!clientInfo) {
            throw new errors_1.BadRequestError("Meta data not found");
        }
        return {
            name: ((_d = clientInfo.profile) === null || _d === void 0 ? void 0 : _d.name) || null,
            id: clientInfo.wa_id
        };
    }
    sendReadRecipt(messageId, fromId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const readReceipt = {
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: messageId
                };
                yield this.send(readReceipt, fromId, token);
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    send(messageObject, fromId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/${process.env.WHATSAPP_VID}/${fromId}/messages`, messageObject, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return response;
            }
            catch (error) {
                throw new errors_1.ExternalAPIError(undefined, {
                    service: "whatsapp",
                    originalError: error.message
                });
            }
        });
    }
    textMessage(message, to) {
        const messageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: {
                preview_url: true,
                body: message.text
            }
        };
        return messageObject;
    }
    buttonsMessage(message, to) {
        const interactiveObject = {
            type: "button",
            body: {
                text: message.body,
            },
            action: {
                buttons: message.buttons,
            },
        };
        if (message.header) {
            interactiveObject.header = message.header;
        }
        if (message.footer) {
            interactiveObject.footer = { text: message.footer };
        }
        const messageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: interactiveObject,
        };
        return messageObject;
    }
    mediaMessage(message, to, type) {
        const mediaObject = {
            link: message.media[0],
        };
        if (message.text) {
            mediaObject.caption = message.text;
        }
        const messageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: type,
            [type]: mediaObject
        };
        return messageObject;
    }
    getMediaContent(message, conversationId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getMedia(message.id, token, conversationId);
            return [url];
        });
    }
}
exports.default = WhatsappService;
