"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureConversationsDependencies = configureConversationsDependencies;
const ConversationsService_1 = __importDefault(require("./ConversationsService"));
const ConversationsController_1 = __importDefault(require("./ConversationsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const ConversationsRepository_1 = __importDefault(require("./ConversationsRepository"));
function configureConversationsDependencies(pool) {
    const repository = new ConversationsRepository_1.default(pool);
    const service = new ConversationsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new ConversationsController_1.default(httpService, service);
    Container_1.default.register("ConversationsService", service);
    Container_1.default.register("ConversationsController", controller);
    return;
}
