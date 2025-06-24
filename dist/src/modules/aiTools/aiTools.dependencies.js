"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAiToolsDependencies = configureAiToolsDependencies;
const AiToolsService_1 = __importDefault(require("./AiToolsService"));
const AiToolsController_1 = __importDefault(require("./AiToolsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const AiToolsRepository_1 = __importDefault(require("./AiToolsRepository"));
function configureAiToolsDependencies(pool) {
    const repository = new AiToolsRepository_1.default(pool);
    const service = new AiToolsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const agentsService = Container_1.default.resolve("AgentsService");
    const controller = new AiToolsController_1.default(httpService, service, agentsService);
    Container_1.default.register("AiToolsService", service);
    Container_1.default.register("AiToolsController", controller);
    return;
}
