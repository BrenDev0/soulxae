"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSessionsDependencies = configureSessionsDependencies;
const SessionsService_1 = __importDefault(require("./SessionsService"));
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
function configureSessionsDependencies(client) {
    const service = new SessionsService_1.default(client);
    Container_1.default.register("SessionsService", service);
    return;
}
