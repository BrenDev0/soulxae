"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubscriptionsDependencies = configureSubscriptionsDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const SubscriptionsService_1 = __importDefault(require("./SubscriptionsService"));
const SubscriptionsController_1 = __importDefault(require("./SubscriptionsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureSubscriptionsDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "subscriptions");
    const service = new SubscriptionsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new SubscriptionsController_1.default(httpService, service);
    Container_1.default.register("SubscriptionsService", service);
    Container_1.default.register("SubscriptionsController", controller);
    return;
}
