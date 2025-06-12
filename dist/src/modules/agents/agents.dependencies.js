"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAgentsDependencies = configureAgentsDependencies;
const AgentsService_1 = __importDefault(require("./AgentsService"));
const AgentsController_1 = __importDefault(require("./AgentsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const AgentsRepository_1 = require("./AgentsRepository");
function configureAgentsDependencies(pool) {
    const repository = new AgentsRepository_1.AgentsRepository(pool);
    const service = new AgentsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new AgentsController_1.default(httpService, service);
    Container_1.default.register("AgentsService", service);
    Container_1.default.register("AgentsController", controller);
    return;
}
