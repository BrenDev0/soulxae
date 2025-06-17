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
class MessengerService {
    constructor() {
        this.block = "messenger.service";
    }
    handleOutgoingMessage(message, fromId, to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let messageObject;
                switch (message.type) {
                    case "audio":
                        messageObject = this.mediaMessage(message.content, to, "audio");
                        break;
                    case "buttons":
                        messageObject = this.buttonsMessage(message.content, to);
                        break;
                    case "document":
                        messageObject = this.mediaMessage(message.content, to, "files");
                        break;
                    case "image":
                        messageObject = this.mediaMessage(message.content, to, "image");
                        break;
                    case "text":
                        messageObject = this.textMessage(message.content, to);
                        break;
                    case "video":
                        messageObject = this.mediaMessage(message.content, to, "video");
                        break;
                    default:
                        break;
                }
                if (!messageObject) {
                    throw new errors_1.BadRequestError("Unsupported message type");
                }
                const response = yield this.send(messageObject, fromId, token);
                if (!response.data || !response.data.message_id) {
                    throw new errors_1.ExternalAPIError();
                }
                return response.data.message_id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    handleIncomingMessage(req, fromId, token, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const message = (_b = (_a = req.body.entry[0]) === null || _a === void 0 ? void 0 : _a.messaging[0]) === null || _b === void 0 ? void 0 : _b.message;
                if (!message) {
                    throw new errors_1.BadRequestError(undefined, {
                        req: req.body
                    });
                }
                console.log(message, ":::::::::::::::::::::message");
                let messageData = {
                    messageReferenceId: message.mid,
                    conversationId: conversationId,
                    sender: "client",
                    type: "text",
                    content: {
                        body: `Unsupported Message type`
                    }
                };
                if (message.text) {
                    messageData.content = {
                        body: message.text
                    };
                }
                else if (message.attachments) {
                    messageData.type = message.attachments[0].type;
                    messageData.content = this.getMediaContent(message.attachments);
                }
                return messageData;
            }
            catch (error) {
                console.log(error, ":::::::::error");
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
    send(messageObject, fromId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/${process.env.MESSENGER_VERSION}/${fromId}/messages?access_token=${token}`, messageObject);
                console.log(response.data);
                return response;
            }
            catch (error) {
                throw new errors_1.ExternalAPIError(undefined, {
                    service: "messenger",
                    originalError: error.message
                });
            }
        });
    }
    getClientInfo(req, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = req.body.entry[0].messaging[0].message;
            const response = yield axios_1.default.get(`https://graph.facebook.com/${process.env.MESSENGER_VERSION}/${message.mid}?fields=id,created_time,from,to,message&access_token=${token}`);
            if (!response) {
                throw new errors_1.BadRequestError("Meta data not found");
            }
            return {
                name: response.data.from.name || null,
                id: response.data.from.id
            };
        });
    }
    textMessage(message, to) {
        const messengerObject = {
            recipient: {
                id: to
            },
            messaging_type: "RESPONSE",
            message: {
                text: message.body
            }
        };
        return messengerObject;
    }
    buttonsMessage(message, to) {
        let elements = {
            subtitle: "Unsuported message type",
            buttons: []
        };
        if (message.header) {
            switch (message.header.type) {
                case "image":
                    elements.image_url = message.header.image;
                    break;
                case "text":
                    elements.title = message.header.text;
                    break;
                default:
                    break;
            }
        }
        if (message.body) {
            elements.subtitle = message.body;
        }
        if (message.buttons) {
            elements.buttons = message.buttons.map((button) => {
                return {
                    type: "postback",
                    title: button.reply.title,
                    payload: button.reply.id
                };
            });
        }
        let messengerObject = {
            recipient: {
                id: to
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: elements
                    }
                }
            }
        };
        return messengerObject;
    }
    mediaMessage(message, to, type) {
        const attachments = message.urls.map((url) => {
            return {
                type: type,
                payload: {
                    url: url,
                }
            };
        });
        let messengerObject = {
            recipient: {
                id: to
            },
            message: {
                attachments: attachments
            }
        };
        console.log(messengerObject, "object:::::::::");
        return messengerObject;
    }
    getMediaContent(message) {
        const urls = message.map((attachment) => attachment.payload.url);
        const mediaContent = {
            urls: urls,
            caption: null
        };
        return mediaContent;
    }
}
exports.default = MessengerService;
