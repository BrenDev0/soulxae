"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureWebhooksDependencies = configureWebhooksDependencies;
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const WebhooksService_1 = __importDefault(require("./WebhooksService"));
function configureWebhooksDependencies() {
    const httpService = Container_1.default.resolve("HttpService");
    const service = new WebhooksService_1.default(httpService);
    Container_1.default.register("WebhookService", service);
    return;
}
