"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureWhatsappDependencies = configureWhatsappDependencies;
const WhatsappService_1 = __importDefault(require("./WhatsappService"));
const WhatsappController_1 = __importDefault(require("./WhatsappController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureWhatsappDependencies() {
    const service = new WhatsappService_1.default();
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new WhatsappController_1.default(httpService);
    Container_1.default.register("WhatsappService", service);
    Container_1.default.register("WhatsappController", controller);
    return;
}
