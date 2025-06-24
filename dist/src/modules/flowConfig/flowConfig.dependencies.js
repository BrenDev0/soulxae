"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureFlowConfigDependencies = configureFlowConfigDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const FlowConfigService_1 = __importDefault(require("./FlowConfigService"));
const FlowConfigController_1 = __importDefault(require("./FlowConfigController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureFlowConfigDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "flow_config");
    const service = new FlowConfigService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const agentsService = Container_1.default.resolve("AgentsService");
    const controller = new FlowConfigController_1.default(httpService, service, agentsService);
    Container_1.default.register("FlowConfigService", service);
    Container_1.default.register("FlowConfigController", controller);
    return;
}
