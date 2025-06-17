import Container from './Container'
import databaseInstance from "../database/Database";
import ErrorHandler from '../errors/ErrorHandler';
import MiddlewareService from '../middleware/MiddlewareService';
import EncryptionService from '../services/EncryptionService';
import { Pool } from 'pg';
import UserService from '../../modules/users/UsersService';
import { configureUsersDependencies } from '../../modules/users/users.dependencies';
import EmailService from '../services/EmailService';
import { RedisClientType } from 'redis';
import HttpService from '../services/HttpService';
import WebTokenService from '../services/WebtokenService';
import PasswordService from '../services/PasswordService';
import HttpRequestValidationService from '../services/HttpRequestValidationService';
import RedisService from '../services/RedisService';
import { configureAgentsDependencies } from '../../modules/agents/agents.dependencies';
import { configurePlatformsDependencies } from '../../modules/platforms/platforms.dependencies';
import { configureConversationsDependencies } from '../../modules/conversations/conversations.dependencies';
import { configureClientsDependencies } from '../../modules/clients/clients.dependencies';
import { configureSessionsDependencies } from '../../modules/sessions/sessions.dependencies';
import { configureWhatsappDependencies } from '../../modules/whatsapp/whatsapp.dependencies';
import { configureMessagesDependencies } from '../../modules/messages/messages.dependencies';
import { configureDirectMessagingDependencies } from '../../modules/directMessaging/directMessaging.dependencies';
import { configureWebhooksDependencies } from '../../modules/webhooks/webhooks.dependencies';
import { configureMediaDependencies } from '../../modules/media/media.dependencies';
import { configureMessengerDependencies } from '../../modules/messenger/messenger.dependencies';
import { configureSubscriptionsDependencies } from '../../modules/subscriptions/subscriptions.dependencies';


export async function configureContainer(testPool?: Pool, testRedis?: string): Promise<void> {
    // pool //
    const pool =  testPool ?? await databaseInstance.getPool();
    Container.register<Pool>("Pool", pool);

    // Encryption //
    const encryptionService = new EncryptionService();
    Container.register<EncryptionService>("EncryptionService", encryptionService);

    // password //
    const passwordService = new PasswordService();
    Container.register<PasswordService>("PasswordService", passwordService);

    // webtoken //
    const webtokenService = new WebTokenService();
    Container.register<WebTokenService>("WebtokenService", webtokenService);

    // http request validation //
    const httpRequestValidationService = new HttpRequestValidationService();
    Container.register<HttpRequestValidationService>("HttpRequestValidationService", httpRequestValidationService);
    
    // errors //
    const errorHandler = new ErrorHandler(pool)
    Container.register("ErrorHandler", errorHandler);

    // email //
    const emailService = new EmailService();
    Container.register<EmailService>("EmailService", emailService);

    const httpService = new HttpService(httpRequestValidationService, passwordService, webtokenService, encryptionService);
    Container.register<HttpService>("HttpService", httpService);

     // redis // 
    const connectionUrl = testRedis ?? (process.env.REDIS_URL as string || "");
    const redisClient = await new RedisService(connectionUrl).createClient();
    Container.register<RedisClientType>("RedisClient", redisClient);

    // agents //
    configureAgentsDependencies(pool);

    // clients // 
    configureClientsDependencies(pool);

    // conversations //
    configureConversationsDependencies(pool);

    // media //
    configureMediaDependencies(pool);

    // messages //
    configureMessagesDependencies(pool);

    // platforms //
    configurePlatformsDependencies(pool);

    // sessions //
    configureSessionsDependencies(redisClient);

    // subscriptions //
    configureSubscriptionsDependencies(pool);

    // users //
    configureUsersDependencies(pool);

    // webhooks //
    configureWebhooksDependencies();


    // messaging services  --- must configure webhooks above this block //

    // messenger //
    configureMessengerDependencies();

    // whatsapp //
    configureWhatsappDependencies();

    // direct to client messaging //
    configureDirectMessagingDependencies()
    

   // middleware --- must configure users above this block //
    const usersService = Container.resolve<UserService>("UsersService");
    const middlewareService = new MiddlewareService(webtokenService, usersService, errorHandler);
    Container.register<MiddlewareService>("MiddlewareService", middlewareService);   
     
    return;
}