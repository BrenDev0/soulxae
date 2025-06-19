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
    const conversationId = "0fb1a939-e56f-4cc6-bf64-41ecd7451459"

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
      //           conversationId: conversationId,
      //           type: "image",
      //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/6c797893-3145-4c55-836a-df6449ba54f2/c352ab7c-94af-4944-9e3f-ea47b5515906/682ada70-15f8-45ff-98ed-714868b31bdc/1792023d-7e24-44a7-8c4a-aa3d55282a25/image/jpeg/1085168556809467"],
      //           mediaType: "image/jpeg"
      //       }
      //     });
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');


      // });

      // it('should send audio message', async () => {
      //   const res = await request(app)
      //     .post('/direct/secure/send')
      //     .set('Authorization', token)
      //     .send({
      //       message: {
      //           conversationId: conversationId,
      //           type: "audio",
      //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/audio/ogg/1959631054845857"],
      //           mediaType: "audio/ogg"
      //       }
      //     });

      //     console.log(res.body)
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');

        
      // });

      // it('should send text message ', async () => {
      //   const res = await request(app)
      //     .post('/direct/secure/send')
      //     .set('Authorization', token)
      //     .send({
      //       message: {
      //           conversationId: conversationId,
      //           type: "text",
      //           text: "hello from jest"
      //       }
      //     });

      //     console.log(res.body)
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');

        
      // });

      // it('should send image message with text ', async () => {
      //   const res = await request(app)
      //     .post('/direct/secure/send')
      //     .set('Authorization', token)
      //     .send({
      //       message: {
      //           conversationId: conversationId,
      //           type: "image",
      //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/6c797893-3145-4c55-836a-df6449ba54f2/c352ab7c-94af-4944-9e3f-ea47b5515906/682ada70-15f8-45ff-98ed-714868b31bdc/1792023d-7e24-44a7-8c4a-aa3d55282a25/image/jpeg/1085168556809467"],
      //           mediaType: "image/jpeg",
      //           text: "hello with image"
      //       }
      //     });

      //     console.log(res.body)
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');

        
      // });


       it('should send video message', async () => {
        const res = await request(app)
          .post('/direct/secure/send')
          .set('Authorization', token)
          .send({
            message: {
                conversationId: conversationId,
                type: "video",
                media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/video/mp4/1610303579644893"],
                mediaType: "video/mp4"
            }
          });

          console.log(res.body)
    
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message sent');

        
      });

      //  it('should send video message with text', async () => {
      //   const res = await request(app)
      //     .post('/direct/secure/send')
      //     .set('Authorization', token)
      //     .send({
      //       message: {
      //           conversationId: conversationId,
      //           type: "video",
      //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/video/mp4/1610303579644893"],
      //           mediaType: "video/mp4",
      //           text: "video with text"
      //       }
      //     });

      //     console.log(res.body)
    
      //   expect(res.status).toBe(200);
      //   expect(res.body.message).toBe('Message sent');

        
      // });

  })
})

