"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMessagesDependencies = configureMessagesDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const MessagesService_1 = __importDefault(require("./MessagesService"));
const MessagesController_1 = __importDefault(require("./MessagesController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureMessagesDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "messages");
    const service = new MessagesService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new MessagesController_1.default(httpService, service);
    Container_1.default.register("MessagesService", service);
    Container_1.default.register("MessagesController", controller);
    return;
}
