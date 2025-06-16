"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMessengerDependencies = configureMessengerDependencies;
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const MessengerController_1 = __importDefault(require("./MessengerController"));
const MessengerService_1 = __importDefault(require("./MessengerService"));
function configureMessengerDependencies() {
    const service = new MessengerService_1.default();
    const httpService = Container_1.default.resolve("HttpService");
    const webhookService = Container_1.default.resolve("WebhookService");
    const controller = new MessengerController_1.default(httpService, webhookService);
    Container_1.default.register("MessengerService", service);
    Container_1.default.register("MessengerController", controller);
    return;
}
