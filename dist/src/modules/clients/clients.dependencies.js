"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureClientsDependencies = configureClientsDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const ClientsService_1 = __importDefault(require("./ClientsService"));
const ClientsController_1 = __importDefault(require("./ClientsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureClientsDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "clients");
    const service = new ClientsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new ClientsController_1.default(httpService, service);
    Container_1.default.register("ClientsService", service);
    Container_1.default.register("ClientsController", controller);
    return;
}
