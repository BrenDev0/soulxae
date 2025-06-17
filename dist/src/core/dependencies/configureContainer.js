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
const workspaces_dependencies_1 = require("../../modules/workspaces/workspaces.dependencies");
const agents_dependencies_1 = require("../../modules/agents/agents.dependencies");
const platforms_dependencies_1 = require("../../modules/platforms/platforms.dependencies");
const conversations_dependencies_1 = require("../../modules/conversations/conversations.dependencies");
const clients_dependencies_1 = require("../../modules/clients/clients.dependencies");
const sessions_dependencies_1 = require("../../modules/sessions/sessions.dependencies");
const whatsapp_dependencies_1 = require("../../modules/whatsapp/whatsapp.dependencies");
const messages_dependencies_1 = require("../../modules/messages/messages.dependencies");
const directMessaging_dependencies_1 = require("../../modules/directMessaging/directMessaging.dependencies");
const webhooks_dependencies_1 = require("../../modules/webhooks/webhooks.dependencies");
const media_dependencies_1 = require("../../modules/media/media.dependencies");
const messenger_dependencies_1 = require("../../modules/messenger/messenger.dependencies");
const subscriptions_dependencies_1 = require("../../modules/subscriptions/subscriptions.dependencies");
function configureContainer(testPool, testRedis) {
    return __awaiter(this, void 0, void 0, function* () {
        // pool //
        const pool = testPool !== null && testPool !== void 0 ? testPool : yield Database_1.default.getPool();
        Container_1.default.register("Pool", pool);
        // Encryption //
        const encryptionService = new EncryptionService_1.default();
        Container_1.default.register("EncryptionService", encryptionService);
        // password //
        const passwordService = new PasswordService_1.default();
        Container_1.default.register("PasswordService", passwordService);
        // webtoken //
        const webtokenService = new WebtokenService_1.default();
        Container_1.default.register("WebtokenService", webtokenService);
        // http request validation //
        const httpRequestValidationService = new HttpRequestValidationService_1.default();
        Container_1.default.register("HttpRequestValidationService", httpRequestValidationService);
        // errors //
        const errorHandler = new ErrorHandler_1.default(pool);
        Container_1.default.register("ErrorHandler", errorHandler);
        // email //
        const emailService = new EmailService_1.default();
        Container_1.default.register("EmailService", emailService);
        const httpService = new HttpService_1.default(httpRequestValidationService, passwordService, webtokenService, encryptionService);
        Container_1.default.register("HttpService", httpService);
        // redis // 
        const connectionUrl = testRedis !== null && testRedis !== void 0 ? testRedis : (process.env.REDIS_URL || "");
        const redisClient = yield new RedisService_1.default(connectionUrl).createClient();
        Container_1.default.register("RedisClient", redisClient);
        // agents //
        (0, agents_dependencies_1.configureAgentsDependencies)(pool);
        // clients // 
        (0, clients_dependencies_1.configureClientsDependencies)(pool);
        // conversations //
        (0, conversations_dependencies_1.configureConversationsDependencies)(pool);
        // media //
        (0, media_dependencies_1.configureMediaDependencies)(pool);
        // messages //
        (0, messages_dependencies_1.configureMessagesDependencies)(pool);
        // platforms //
        (0, platforms_dependencies_1.configurePlatformsDependencies)(pool);
        // sessions //
        (0, sessions_dependencies_1.configureSessionsDependencies)(redisClient);
        // subscriptions //
        (0, subscriptions_dependencies_1.configureSubscriptionsDependencies)(pool);
        // users //
        (0, users_dependencies_1.configureUsersDependencies)(pool);
        // webhooks //
        (0, webhooks_dependencies_1.configureWebhooksDependencies)();
        // workspaces //
        (0, workspaces_dependencies_1.configureWorkspacesDependencies)(pool);
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
