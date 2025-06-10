"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureWorkspacesDependencies = configureWorkspacesDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const WorkspacesService_1 = __importDefault(require("./WorkspacesService"));
const WorkspacesController_1 = __importDefault(require("./WorkspacesController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureWorkspacesDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "workspaces");
    const service = new WorkspacesService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new WorkspacesController_1.default(httpService, service);
    Container_1.default.register("WorkspacesService", service);
    Container_1.default.register("WorkspacesController", controller);
    return;
}
