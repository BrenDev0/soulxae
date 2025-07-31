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
exports.configureContainer = configureContainer;
const Container_1 = __importDefault(require("./Container"));
const Database_1 = __importDefault(require("../database/Database"));
const ErrorHandler_1 = __importDefault(require("../errors/ErrorHandler"));
const MiddlewareService_1 = __importDefault(require("../middleware/MiddlewareService"));
const EncryptionService_1 = __importDefault(require("../services/EncryptionService"));
const users_dependencies_1 = require("../../modules/users/users.dependencies");
const EmailService_1 = __importDefault(require("../services/EmailService"));
const HttpService_1 = __importDefault(require("../services/HttpService"));
const WebtokenService_1 = __importDefault(require("../services/WebtokenService"));
const PasswordService_1 = __importDefault(require("../services/PasswordService"));
const HttpRequestValidationService_1 = __importDefault(require("../services/HttpRequestValidationService"));
const RedisService_1 = __importDefault(require("../services/RedisService"));
const agents_dependencies_1 = require("../../modules/agents/agents.dependencies");
const platforms_dependencies_1 = require("../../modules/platforms/platforms.dependencies");
const conversations_dependencies_1 = require("../../modules/conversations/conversations.dependencies");
const clients_dependencies_1 = require("../../modules/clients/clients.dependencies");
const whatsapp_dependencies_1 = require("../../modules/whatsapp/whatsapp.dependencies");
const messages_dependencies_1 = require("../../modules/messages/messages.dependencies");
const directMessaging_dependencies_1 = require("../../modules/directMessaging/directMessaging.dependencies");
const webhooks_dependencies_1 = require("../../modules/webhooks/webhooks.dependencies");
const media_dependencies_1 = require("../../modules/media/media.dependencies");
const messenger_dependencies_1 = require("../../modules/messenger/messenger.dependencies");
const subscriptions_dependencies_1 = require("../../modules/subscriptions/subscriptions.dependencies");
const employees_dependencies_1 = require("../../modules/employees/employees.dependencies");
const aiConfig_dependencies_1 = require("../../modules/aiConfig/aiConfig.dependencies");
const flowConfig_dependencies_1 = require("../../modules/flowConfig/flowConfig.dependencies");
const aiTools_dependencies_1 = require("../../modules/aiTools/aiTools.dependencies");
const WebSocketService_1 = __importDefault(require("../../modules/webSocket/WebSocketService"));
const google_dependencies_1 = require("../../modules/google/google.dependencies");
function configureContainer(testPool, testRedis) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = testPool !== null && testPool !== void 0 ? testPool : yield Database_1.default.getPool();
        Container_1.default.register("Pool", pool);
        //// Core  ////
        // independent instances //
        const emailService = new EmailService_1.default();
        Container_1.default.register("EmailService", emailService);
        const encryptionService = new EncryptionService_1.default();
        Container_1.default.register("EncryptionService", encryptionService);
        const errorHandler = new ErrorHandler_1.default(pool);
        Container_1.default.register("ErrorHandler", errorHandler);
        const httpRequestValidationService = new HttpRequestValidationService_1.default();
        Container_1.default.register("HttpRequestValidationService", httpRequestValidationService);
        const passwordService = new PasswordService_1.default();
        Container_1.default.register("PasswordService", passwordService);
        const connectionUrl = testRedis !== null && testRedis !== void 0 ? testRedis : (process.env.REDIS_URL || "");
        const redisClient = yield new RedisService_1.default(connectionUrl).createClient();
        Container_1.default.register("RedisClient", redisClient);
        const webSocketService = new WebSocketService_1.default();
        Container_1.default.register("WebSocketService", webSocketService);
        const webtokenService = new WebtokenService_1.default();
        Container_1.default.register("WebtokenService", webtokenService);
        // dependent //
        const httpService = new HttpService_1.default(httpRequestValidationService, passwordService, webtokenService, encryptionService);
        Container_1.default.register("HttpService", httpService);
        //// Modules ////
        // agents //
        (0, agents_dependencies_1.configureAgentsDependencies)(pool);
        // clients // 
        (0, clients_dependencies_1.configureClientsDependencies)(pool);
        // conversations //
        (0, conversations_dependencies_1.configureConversationsDependencies)(pool);
        // employees //
        (0, employees_dependencies_1.configureEmployeesDependencies)(pool);
        // google //
        (0, google_dependencies_1.configureGoogleDependencies)(pool);
        // media //
        (0, media_dependencies_1.configureMediaDependencies)(pool);
        // messages //
        (0, messages_dependencies_1.configureMessagesDependencies)(pool);
        // platforms //
        (0, platforms_dependencies_1.configurePlatformsDependencies)(pool);
        // subscriptions //
        (0, subscriptions_dependencies_1.configureSubscriptionsDependencies)(pool);
        // users //
        (0, users_dependencies_1.configureUsersDependencies)(pool);
        // webhooks //
        (0, webhooks_dependencies_1.configureWebhooksDependencies)();
        // agent configs --- must configure agents above this block 
        // ai config
        (0, aiConfig_dependencies_1.configureAiConfigDependencies)(pool);
        // ai tools
        (0, aiTools_dependencies_1.configureAiToolsDependencies)(pool);
        // flow config
        (0, flowConfig_dependencies_1.configureFlowConfigDependencies)(pool);
        // messaging services  --- must configure webhooks above this block //
        // messenger //
        (0, messenger_dependencies_1.configureMessengerDependencies)();
        // whatsapp //
        (0, whatsapp_dependencies_1.configureWhatsappDependencies)();
        // direct to client messaging //
        (0, directMessaging_dependencies_1.configureDirectMessagingDependencies)();
        // middleware --- must configure users above this block //
        const usersService = Container_1.default.resolve("UsersService");
        const middlewareService = new MiddlewareService_1.default(webtokenService, usersService, errorHandler);
        Container_1.default.register("MiddlewareService", middlewareService);
        return;
    });
}
