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
const agents_routes_1 = require("./modules/agents/agents.routes");
const platforms_routes_1 = require("./modules/platforms/platforms.routes");
const users_routes_1 = require("./modules/users/users.routes");
const directMessaging_routes_1 = require("./modules/directMessaging/directMessaging.routes");
const clients_routes_1 = require("./modules/clients/clients.routes");
const conversations_routes_1 = require("./modules/conversations/conversations.routes");
const whatsapp_routes_1 = require("./modules/whatsapp/whatsapp.routes");
const messenger_routes_1 = require("./modules/messenger/messenger.routes");
const employees_routes_1 = require("./modules/employees/employees.routes");
const media_routes_1 = require("./modules/media/media.routes");
const aiConfig_routes_1 = require("./modules/aiConfig/aiConfig.routes");
const flowConfig_routes_1 = require("./modules/flowConfig/flowConfig.routes");
const aiTools_routes_1 = require("./modules/aiTools/aiTools.routes");
const server = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, createApp_1.default)();
    yield (0, configureContainer_1.configureContainer)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    // routers //
    const aiConfigRouter = (0, aiConfig_routes_1.initializeAiConfigRouter)();
    const aiToolsRouter = (0, aiTools_routes_1.initializeAiToolsRouter)();
    const agentsRouter = (0, agents_routes_1.initializeAgentsRouter)();
    const clientsRouter = (0, clients_routes_1.initializeClientsRouter)();
    const conversationsRouter = (0, conversations_routes_1.initializeConversationsRouter)();
    const directMessagingRouter = (0, directMessaging_routes_1.initializeDirectMessageingRouter)();
    const employeesRouter = (0, employees_routes_1.initializeEmployeesRouter)();
    const flowConfigRouter = (0, flowConfig_routes_1.initializeFlowConfigRouter)();
    const mediaRouter = (0, media_routes_1.initializeMediaRouter)();
    const messengerRouter = (0, messenger_routes_1.initializeMessengerRouter)();
    const platformsRouter = (0, platforms_routes_1.initializePlatformsRouter)();
    const usersRouter = (0, users_routes_1.initializeUsersRouter)();
    const whatsappRouter = (0, whatsapp_routes_1.initializeWhatsappRouter)();
    // Routes //
    process.env.NODE_ENV === "production" && app.use(middlewareService.verifyHMAC);
    process.env.NODE_ENV !== 'production' && app.use('/docs/endpoints', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    app.use("/ai-config", aiConfigRouter);
    app.use("ai-tools", aiToolsRouter);
    app.use("/agents", agentsRouter);
    app.use("/clients", clientsRouter);
    app.use("/conversatations", conversationsRouter);
    app.use("/direct", directMessagingRouter);
    app.use("/employees", employeesRouter);
    app.use("/flow-config", flowConfigRouter);
    app.use("/media", mediaRouter);
    app.use("/messenger", messengerRouter);
    app.use("/platforms", platformsRouter);
    app.use("/users", usersRouter);
    app.use("/whatsapp", whatsappRouter);
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
