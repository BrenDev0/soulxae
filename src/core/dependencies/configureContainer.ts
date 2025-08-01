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
import { configureWhatsappDependencies } from '../../modules/whatsapp/whatsapp.dependencies';
import { configureMessagesDependencies } from '../../modules/messages/messages.dependencies';
import { configureDirectMessagingDependencies } from '../../modules/directMessaging/directMessaging.dependencies';
import { configureWebhooksDependencies } from '../../modules/webhooks/webhooks.dependencies';
import { configureMediaDependencies } from '../../modules/media/media.dependencies';
import { configureMessengerDependencies } from '../../modules/messenger/messenger.dependencies';
import { configureSubscriptionsDependencies } from '../../modules/subscriptions/subscriptions.dependencies';
import { configureEmployeesDependencies } from '../../modules/employees/employees.dependencies';
import { configureAiConfigDependencies } from '../../modules/aiConfig/aiConfig.dependencies';
import { configureFlowConfigDependencies } from '../../modules/flowConfig/flowConfig.dependencies';
import WebSocketService from '../../modules/webSocket/WebSocketService';
import { configureGoogleDependencies } from '../../modules/google/google.dependencies';
import { configureCalendarsDependencies } from '../../modules/calendars/calendars.dependencies';


export async function configureContainer(testPool?: Pool, testRedis?: string): Promise<void> {
    const pool =  testPool ?? await databaseInstance.getPool();
    Container.register<Pool>("Pool", pool);

    //// Core  ////

    // independent instances //
    const emailService = new EmailService();
    Container.register<EmailService>("EmailService", emailService);
  
    const encryptionService = new EncryptionService();
    Container.register<EncryptionService>("EncryptionService", encryptionService);

    const errorHandler = new ErrorHandler(pool)
    Container.register("ErrorHandler", errorHandler);

    const httpRequestValidationService = new HttpRequestValidationService();
    Container.register<HttpRequestValidationService>("HttpRequestValidationService", httpRequestValidationService);

    const passwordService = new PasswordService();
    Container.register<PasswordService>("PasswordService", passwordService);

    
    const connectionUrl = testRedis ?? (process.env.REDIS_URL as string || "");
    const redisClient = await new RedisService(connectionUrl).createClient();
    Container.register<RedisClientType>("RedisClient", redisClient);


    const webSocketService = new WebSocketService();
    Container.register<WebSocketService>("WebSocketService", webSocketService);

    const webtokenService = new WebTokenService();
    Container.register<WebTokenService>("WebtokenService", webtokenService);


    // dependent //
    const httpService = new HttpService(httpRequestValidationService, passwordService, webtokenService, encryptionService);
    Container.register<HttpService>("HttpService", httpService);




    //// Modules ////

    // agents //
    configureAgentsDependencies(pool);

    // calendars //
    configureCalendarsDependencies(pool);

    // clients // 
    configureClientsDependencies(pool);

    // conversations //
    configureConversationsDependencies(pool);

    // employees //
    configureEmployeesDependencies(pool);

    // google //

    configureGoogleDependencies(pool)

    // media //
    configureMediaDependencies(pool);

    // messages //
    configureMessagesDependencies(pool);

    // platforms //
    configurePlatformsDependencies(pool);

    // subscriptions //
    configureSubscriptionsDependencies(pool);

    // users //
    configureUsersDependencies(pool);

    // webhooks //
    configureWebhooksDependencies();


    // agent configs --- must configure agents above this block 

    // ai config
    configureAiConfigDependencies(pool);

    // flow config
    configureFlowConfigDependencies(pool);

    


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