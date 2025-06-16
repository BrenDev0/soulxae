"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAgenciesDependencies = configureAgenciesDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const AgenciesService_1 = __importDefault(require("./AgenciesService"));
const AgenciesController_1 = __importDefault(require("./AgenciesController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureAgenciesDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "agencies");
    const service = new AgenciesService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new AgenciesController_1.default(httpService, service);
    Container_1.default.register("AgenciesService", service);
    Container_1.default.register("AgenciesController", controller);
    return;
}
