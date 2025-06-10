"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./core/swagger/swagger.json"));
const configureContainer_1 = require("./core/dependencies/configureContainer");
const Container_1 = __importDefault(require("./core/dependencies/Container"));
const server = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, createApp_1.default)();
    yield (0, configureContainer_1.configureContainer)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    // routers //
    // Routes //
    process.env.NODE_ENV === "production" && app.use(middlewareService.verifyHMAC);
    process.env.NODE_ENV !== 'production' && app.use('/docs/endpoints', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    app.use((req, res) => {
        res.status(404).json({ message: "Route not found." });
    });
    app.use(middlewareService.handleErrors.bind(middlewareService));
    const PORT = process.env.SERVER_PORT || 3000;
    app.listen(PORT, () => {
        console.log("online");
    });
});
server();
