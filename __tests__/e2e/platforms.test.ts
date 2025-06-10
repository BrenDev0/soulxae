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

        const router = initializePlatformsRouter();

        app.use("/platforms", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })


    describe('POST /platforms/secure/create', () => {
//   it('should return 200 and message when platform is created', async () => {
//     const res = await request(app)
//       .post('/platforms/secure/create')
//       .set('Authorization', token)
//       .send({
//         agentId: '4825f3f1-78c9-4eab-94f4-019f6bf05f7e',
//         platform: 'whatsapp',
//         token: '123456789'
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('Platform added.');
//   });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/platforms/secure/create')
      .set('Authorization', token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});

describe('GET /platforms/secure/resource/:platformId', () => {
  it('should return 200 and platform data for valid platformId', async () => {
    const res = await request(app)
      .get('/platforms/secure/resource/ab3883b1-4fa6-404e-92cc-95bbae57cf54')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('should return 400 for invalid platformId format', async () => {
    const res = await request(app)
      .get('/platforms/secure/resource/invalid-id')
      .set('Authorization', token);

    expect(res.status).toBe(400);
  });

  it('should return 404 if platform is not found', async () => {
    const res = await request(app)
      .get('/platforms/secure/resource/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
      .set('Authorization', token);

    expect(res.status).toBe(404);
  });
});

describe('PUT /platforms/secure/:platformId', () => {
  it('should return 200 and message when platform is updated', async () => {
    const res = await request(app)
      .put('/platforms/secure/ab3883b1-4fa6-404e-92cc-95bbae57cf54')
      .set('Authorization', token)
      .send({
        token: 'updated-token',
        platform: 'instagram'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('updated');
  });

  it('should return 400 for invalid platformId format', async () => {
    const res = await request(app)
      .put('/platforms/secure/invalid-id')
      .set('Authorization', token)
      .send({ token: 'some-token' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if platform not found', async () => {
    const res = await request(app)
      .put('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
      .set('Authorization', token)
      .send({ token: 'some-token' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /platforms/secure/:platformId', () => {
//   it('should return 200 and message when platform is deleted', async () => {
//     const res = await request(app)
//       .delete('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a10')
//       .set('Authorization', token);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('Platform deleted');
//   });

  it('should return 400 for invalid platformId format', async () => {
    const res = await request(app)
      .delete('/platforms/secure/invalid-id')
      .set('Authorization', token);

    expect(res.status).toBe(400);
  });

  it('should return 404 if platform not found', async () => {
    const res = await request(app)
      .delete('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
      .set('Authorization', token);

    expect(res.status).toBe(404);
  });
});
})