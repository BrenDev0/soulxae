"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDirectMessagingDependencies = configureDirectMessagingDependencies;
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const DirectMessagingController_1 = __importDefault(require("./DirectMessagingController"));
function configureDirectMessagingDependencies() {
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new DirectMessagingController_1.default(httpService);
    Container_1.default.register("DirectMessagingController", controller);
    return;
}
