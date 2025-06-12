import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Express } from 'express';
import createApp from '../../src/createApp';
import request  from 'supertest';
import Container from '../../src/core/dependencies/Container';
import MiddlewareService from '../../src/core/middleware/MiddlewareService';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import { RedisClientType } from 'redis';
import { initializePlatformsRouter } from '../../src/modules/platforms/platforms.routes';
import { initializeConversationsRouter } from '../../src/modules/conversations/conversations.routes';
dotenv.config();
describe("USERS ROUTES", () => {
    let app: Express;
    let pool: Pool;

    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmN2ZmZC1lOTRmLTRmNTktYTc2ZS05ZDcwMDAyM2ZiYTIiLCJpYXQiOjE3NDk1ODEwNTksImV4cCI6MTc4MTExNzA1OX0.S6WoYU-CatNXRb7fq5Xvs39SJ8udLBD4HB8db1-WhxQ";
    const verificationToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25Db2RlIjoxMjM0NTYsImlhdCI6MTc0OTU4MTY2MSwiZXhwIjoxNzgxMTE3NjYxfQ.gBXDKWjdTXn3VBZWoagZyyprqHBQnV1_IUFXsMGRDb8"


    beforeAll(async() => {
    pool  = new Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        })

        app = createApp();

        await configureContainer(pool);
        const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");

        const router = initializeConversationsRouter();

        app.use("/conversations", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })

});

