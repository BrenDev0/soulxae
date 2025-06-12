"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePlatformsDependencies = configurePlatformsDependencies;
const PlatformsService_1 = __importDefault(require("./PlatformsService"));
const PlatformsController_1 = __importDefault(require("./PlatformsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const PlatformsRepository_1 = __importDefault(require("./PlatformsRepository"));
function configurePlatformsDependencies(pool) {
    const repository = new PlatformsRepository_1.default(pool);
    const service = new PlatformsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new PlatformsController_1.default(httpService, service);
    Container_1.default.register("PlatformsService", service);
    Container_1.default.register("PlatformsController", controller);
    return;
}
