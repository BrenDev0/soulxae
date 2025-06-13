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
                    case "image":
                        messageObject = this.imageMessage(message.content, to);
                        break;
                    case "buttons":
                        messageObject = this.buttonsMessage(message.content, to);
                        break;
                    case "text":
                        messageObject = this.textMessage(message.content, to);
                        break;
                    default:
                        break;
                }
                if (!messageObject) {
                    throw new errors_1.BadRequestError();
                }
                yield this.send(messageObject, fromId, token);
            }
            catch (error) {
                throw error;
            }
        });
    }
    handleIncomingMessage(req, fromId, token, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = req.body.entry[0].changes[0].value.messages[0];
                yield this.sendReadRecipt(message.id, fromId, token);
                let messageData = {
                    conversationId: conversationId,
                    sender: "client",
                    type: "text",
                    content: {
                        body: `Unsupported Message type ${message.type}`
                    }
                };
                switch (message.type) {
                    case "image":
                        messageData.content = yield this.getImageMessageContent(message, token);
                        break;
                    case "text":
                        messageData.content = {
                            body: message.text.body
                        };
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
    getMedia(mediaId, token) {
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
                console.log(responseData.headers['content-type'], "Type:_:::::");
                console.log(responseData);
                return responseUrl.data.url;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getClientInfo(req) {
        var _a, _b, _c;
        const clientInfo = (_c = (_b = (_a = req.body.entry[0]) === null || _a === void 0 ? void 0 : _a.changes[0]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.contacts[0];
        if (!clientInfo) {
            throw new errors_1.BadRequestError("Meta data not found");
        }
        return clientInfo;
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
                yield axios_1.default.post(`https://graph.facebook.com/${process.env.WHATSAPP_VID}/${fromId}/messages`, messageObject, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("message sent");
                return;
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
                body: message.body
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
    imageMessage(message, to) {
        let imageObjcet = {
            link: message.url
        };
        if (message.caption) {
            imageObjcet.caption = message.caption;
        }
        const messageObject = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "image",
            image: imageObjcet
        };
        return messageObject;
    }
    getImageMessageContent(message, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getMedia(message.image.id, token);
            const messageContent = {
                url: url,
                caption: message.image.caption ? message.image.caption : null
            };
            return messageContent;
        });
    }
}
exports.default = WhatsappService;
