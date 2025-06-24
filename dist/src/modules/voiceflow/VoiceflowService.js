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
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const errors_1 = require("../../core/errors/errors");
const error_service_1 = require("../../core/errors/error.service");
class VoiceflowService {
    interact(conversationId, request, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = "voiceflow.service.interact";
            try {
                const flowConfigService = Container_1.default.resolve("FlowConfigService");
                const flowConfig = yield flowConfigService.resource(agentId);
                if (!flowConfig) {
                    throw new errors_1.BadRequestError("Agent configuration errror");
                }
                const voiceflowResponse = yield axios_1.default.post(`https://general-runtime.voiceflow.com/state/user/${conversationId}/interact?logs=off`, { request: request }, {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        Authorization: flowConfig.apiKey,
                        'versionID': 'production'
                    }
                });
                if (request.type == "launch") {
                    const options = {
                        method: 'PATCH',
                        url: `https://general-runtime.voiceflow.com/state/user/${conversationId}/variables`,
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/json',
                            Authorization: flowConfig.apiKey,
                            'version': 'production'
                        }
                    };
                    yield (0, axios_1.default)(options);
                }
                console.log("RESPONSE:::::::::::::", voiceflowResponse.data);
                if (!voiceflowResponse || !voiceflowResponse.data || !Array.isArray(voiceflowResponse.data)) {
                    throw new Error('Voiceflow error');
                }
                ;
                yield this.handleVoiceflowData(voiceflowResponse.data);
                return;
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, block, "outgoing", { conversationId, request, agentId });
                throw error;
            }
        });
    }
    handleVoiceflowData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const directMessagingService = Container_1.default.resolve("DirectMessagingService");
            for (let i = 0; i < data.length; i++) {
                const message = data[i];
                const nextMessage = data[i + 1];
                const messageData = {
                    conversationId: "",
                    messageReferenceId: "",
                    sender: "",
                    type: "",
                    text: null,
                    subText: null,
                    media: null,
                    mediaType: null,
                    buttons: null
                };
                if (message.trace.type === "text" && (!nextMessage || ((_a = nextMessage === null || nextMessage === void 0 ? void 0 : nextMessage.trace) === null || _a === void 0 ? void 0 : _a.type) === "text" || ((_b = nextMessage === null || nextMessage === void 0 ? void 0 : nextMessage.trace) === null || _b === void 0 ? void 0 : _b.type) !== "choice")) {
                    messageData.type = "text";
                    messageData.text = message.trace.payload.message;
                    yield directMessagingService.handleOutGoingMessage(messageData);
                    continue;
                }
                else if (message.trace.type === "text" && ((_c = nextMessage === null || nextMessage === void 0 ? void 0 : nextMessage.trace) === null || _c === void 0 ? void 0 : _c.type) === "choice") {
                    messageData.type = "buttons";
                    messageData.text = message.trace.payload.message;
                    messageData.buttons = message.trace.payload.buttons;
                    yield directMessagingService.handleOutGoingMessage(messageData);
                    return;
                }
                else if (message.trace.type === "cardV2") {
                    messageData.type = "buttons";
                    if (message.trace.payload.imageUrl) {
                        message.media = [message.trace.payload.imageUrl];
                    }
                    messageData.text = message.trace.payload.title;
                    messageData.subText = message.trace.payload.description.text;
                    if (message.trace.payload.buttons) {
                        message.buttons = message.trace.payload.buttons;
                    }
                    yield directMessagingService.handleOutGoingMessage(messageData);
                    return;
                }
                else if (message.trace.type === "visual") {
                    messageData.type = "image";
                    messageData.media = [message.trace.payload.image];
                    yield directMessagingService.handleOutGoingMessage(messageData);
                    continue;
                }
                else if (message.end) {
                    return;
                }
            }
        });
    }
}
exports.default = VoiceflowService;
