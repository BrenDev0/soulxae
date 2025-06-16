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
                    case "buttons":
                        messageObject = this.buttonsMessage(message.content, to);
                        break;
                    case "image":
                        messageObject = this.imageMessage(message.content, to);
                        break;
                    case "text":
                        messageObject = this.textMessage(message.content, to);
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
    handleIncomingMessage(req, fromId, token, conversationId, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = req.body.entry[0].messaging[0];
                console.log(message, ":::::::::::::::::::::message");
                let messageData = {
                    messageReferenceId: message.id,
                    conversationId: conversationId,
                    sender: "client",
                    type: "text",
                    content: {
                        body: `Unsupported Message type ${message.type}`
                    }
                };
                // switch(message.type) {
                //     case "audio":
                //         messageData.type = "audio";
                //         messageData.content = await this.getMediaContent(message.audio, conversationId, token, agentId);
                //         break
                //     case "document":
                //         messageData.type = "document"
                //         messageData.content = await this.getMediaContent(message.document, conversationId, token, agentId);
                //         break
                //     case "image":
                //         messageData.type = "image"
                //         messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
                //         break;
                //     case "text":
                //         messageData.content = {
                //             body: message.text.body
                //         } 
                //         break;
                //     case "video":
                //         messageData.type = "video"
                //         messageData.content = await this.getMediaContent(message.image, conversationId, token, agentId)
                //         break;
                //     default: 
                //         break;
                // }
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
                console.log(response);
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
    getClientInfo(req) {
        const clientInfo = req.body.entry[0];
        console.log(clientInfo, "CLinetinfo:::::::::");
        if (!clientInfo) {
            throw new errors_1.BadRequestError("Meta data not found");
        }
        return clientInfo;
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
    imageMessage(message, to) {
        let messengerObject = {
            recipient: {
                id: to
            },
            messaging_type: "RESPONSE",
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: message.url,
                        is_reusable: true
                    }
                }
            }
        };
        return messengerObject;
    }
}
exports.default = MessengerService;
