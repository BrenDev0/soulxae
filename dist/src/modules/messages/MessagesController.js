"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessagesController {
    constructor(httpService, messagesService) {
        this.block = "messages.controller";
        this.httpService = httpService;
        this.messagesService = messagesService;
    }
}
exports.default = MessagesController;
