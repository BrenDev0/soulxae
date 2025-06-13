import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Express } from 'express';
import createApp from '../../src/createApp';
import request  from 'supertest';
import Container from '../../src/core/dependencies/Container';
import MiddlewareService from '../../src/core/middleware/MiddlewareService';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import { RedisClientType } from 'redis';
import { initializeDirectMessageingRouter } from '../../src/modules/directMessaging/directMessaging.routes';
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

        const router = initializeDirectMessageingRouter();

        app.use("/direct", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })

    describe('POST /direct/secure/send', () => {
      // it('should send image message', async () => {
      //   const res = await request(app)
      //     .post('/direct/secure/send')
      //     .set('Authorization', token)
      //     .send({
      //       message: {
      //           conversationId: "29bbc5a6-64c9-4d21-adca-b8fae2b9f43b",
      //           content: {
      //               header: {
      //                   type: "image",
      //                   image: "https://blogs-app.s3.us-east-1.amazonaws.com/images/15/67/blog_image_1.png"
      //               },
      //               body: "hello form jest2",
      //               footer: null,
      //               buttons: null
      //           }
      //       }
      //     });
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');


      // });

      it('should send audio message', async () => {
        const res = await request(app)
          .post('/direct/secure/send')
          .set('Authorization', token)
          .send({
            message: {
                conversationId: "9c00d775-c78f-496c-aad5-2814fdef0ff0",
                type: "audio",
                content: {
                    url: "https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66f8048e-bb28-4d42-ba36-53bbc19dbe3a/audio/ogg/1360710618544424"
                }
            }
          });

          console.log(res.body)
    
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message sent');

        
      });
  })
})

