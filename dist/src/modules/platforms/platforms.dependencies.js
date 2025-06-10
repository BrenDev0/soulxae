"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePlatformsDependencies = configurePlatformsDependencies;
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
const PlatformsService_1 = __importDefault(require("./PlatformsService"));
const PlatformsController_1 = __importDefault(require("./PlatformsController"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configurePlatformsDependencies(pool) {
    const repository = new BaseRepository_1.default(pool, "platforms");
    const service = new PlatformsService_1.default(repository);
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new PlatformsController_1.default(httpService, service);
    Container_1.default.register("PlatformsService", service);
    Container_1.default.register("PlatformsController", controller);
    return;
}
