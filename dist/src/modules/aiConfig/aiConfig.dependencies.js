"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAiConfigDependencies = configureAiConfigDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const AiConfigService_1 = __importDefault(require("./AiConfigService"));
const AiConfigController_1 = __importDefault(require("./AiConfigController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureAiConfigDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "ai_config");
    const service = new AiConfigService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const agentsService = Container_1.default.resolve("AgentsService");
    const controller = new AiConfigController_1.default(httpService, service, agentsService);
    Container_1.default.register("AiConfigService", service);
    Container_1.default.register("AiConfigController", controller);
    return;
}
