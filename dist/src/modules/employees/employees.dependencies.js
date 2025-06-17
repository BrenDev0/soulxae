"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureEmployeesDependencies = configureEmployeesDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const EmployeesService_1 = __importDefault(require("./EmployeesService"));
const EmployeesController_1 = __importDefault(require("./EmployeesController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureEmployeesDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "employees");
    const service = new EmployeesService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new EmployeesController_1.default(httpService, service);
    Container_1.default.register("EmployeesService", service);
    Container_1.default.register("EmployeesController", controller);
    return;
}
