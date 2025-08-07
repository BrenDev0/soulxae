require('node-fetch');

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Express } from 'express';
import createApp from '../../src/createApp';
import request  from 'supertest';
import Container from '../../src/core/dependencies/Container';
import MiddlewareService from '../../src/core/middleware/MiddlewareService';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import { RedisClientType } from 'redis';
import { initializeGoogleCalendarRouter } from '../../src/modules/google/calendar/google.calendar.routes';
dotenv.config();
describe("Google", () => {
    let app: Express;
    let pool: Pool;

    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmN2ZmZC1lOTRmLTRmNTktYTc2ZS05ZDcwMDAyM2ZiYTIiLCJpYXQiOjE3NDk1ODEwNTksImV4cCI6MTc4MTExNzA1OX0.S6WoYU-CatNXRb7fq5Xvs39SJ8udLBD4HB8db1-WhxQ";
    const verificationToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25Db2RlIjoxMjM0NTYsImlhdCI6MTc0OTU4MTY2MSwiZXhwIjoxNzgxMTE3NjYxfQ.gBXDKWjdTXn3VBZWoagZyyprqHBQnV1_IUFXsMGRDb8"
    const conversationId = "4073cb49-3d49-461a-9ca4-e3f3277f6568"

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

        const router = initializeGoogleCalendarRouter();

        app.use("/google/calendars", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })

    // describe("GET EVENTS", () => {
    //     it("should  return calendar events", async() => {
    //         const res = await request(app)
    //       .get('/google/calendars/secure/events/a9698530-99e0-4d6b-9f5d-3fddddc6b4ba')
    //       .set('Authorization', token)
            
    //       console.log(res.body, "RESPONSE::::::::::::::")
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveProperty('data');
    //     })
    // })

    describe("DELETE EVENTS", () => {
        it("should  delete a calendar event", async() => {
            const res = await request(app)
          .delete('/google/calendars/secure/events/a9698530-99e0-4d6b-9f5d-3fddddc6b4ba')
          .set('Authorization', token)
          .send({
            startTime: "2025-08-07T15:00:00",
            attendee: "brendan.soullens@gmail.com"
          })
            
          console.log(res.body, "RESPONSE::::::::::::::")
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        })
    })

})

