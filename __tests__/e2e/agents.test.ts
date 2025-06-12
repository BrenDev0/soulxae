import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Express } from 'express';
import createApp from '../../src/createApp';
import request  from 'supertest';
import Container from '../../src/core/dependencies/Container';
import MiddlewareService from '../../src/core/middleware/MiddlewareService';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import { RedisClientType } from 'redis';
import { initializeWorkspacesRouter } from '../../src/modules/workspaces/workspaces.routes';
import { initializeAgentsRouter } from '../../src/modules/agents/agents.routes';
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

        const router = initializeAgentsRouter();

        app.use("/agents", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })


    
describe('POST /agents/secure/create', () => {
  it('should return 200 and add a new agent', async () => {
    const res = await request(app)
      .post('/agents/secure/create')
      .set('Authorization', token)
      .send({
        apiKey: 'test-api-key',
        description: 'test-description',
        name: 'Test Agent',
        provider: 'openai',
        workspaceId: '6c797893-3145-4c55-836a-df6449ba54f2',
        agentType: "human"
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Agent added.');
  });

  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/agents/secure/create')
      .set('Authorization', token)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 404 for invalid workspace', async () => {
    const res = await request(app)
      .post('/agents/secure/create')
      .set('Authorization', token)
      .send({
        apiKey: 'test-api-key',
        description: 'test-description',
        name: 'Test Agent',
        provider: 'openai',
        workspaceId: "6c797893-3145-4c55-836a-df6449ba54f3"
      });

    expect(res.status).toBe(404);
  });
});

describe('GET /agents/secure/resource/:agentId', () => {
  it('should return 200 and agent data', async () => {
    const res = await request(app)
      .get('/agents/secure/resource/48397e4a-68e3-44a2-83b6-6645c5c4b7a1') // Replace with actual valid agent ID
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  it('should return 400 for invalid UUID', async () => {
    const res = await request(app)
      .get('/agents/secure/resource/invalid-id')
      .set('Authorization', token);

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent agent', async () => {
    const res = await request(app)
      .get(`/agents/secure/resource/6c797893-3145-4c55-836a-df6449ba54f2`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
  });
});

describe('GET /agents/secure/collection/:workspaceId', () => {
  it('should return 200 and agent list', async () => {
    const res = await request(app)
      .get('/agents/secure/collection/6c797893-3145-4c55-836a-df6449ba54f2') // Replace with actual workspace ID
      .set('Authorization', token);

      console.log(res.body, "CollectionSuccess::::::: ")
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 400 for invalid workspaceId format', async () => {
    const res = await request(app)
      .get('/agents/secure/collection/abc')
      .set('Authorization', token);

    expect(res.status).toBe(400);
  });

  it('should return 404 if workspace not found', async () => {
    const res = await request(app)
      .get(`/agents/secure/collection/6c797893-3145-4c55-836a-df6449ba54f9`)
      .set('Authorization', token);

      console.log(res.body, "Collection")
    expect(res.status).toBe(404);
  });
});

describe('PUT /secure/agents/:agentId', () => {
  it('should return 200 on successful update', async () => {
    const res = await request(app)
      .put('/agents/secure/48397e4a-68e3-44a2-83b6-6645c5c4b7a1') // Replace with actual ID
      .set('Authorization', token)
      .send({ name: 'Updated Agent Name' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('updated');
  });

  it('should return 400 for invalid agentId format', async () => {
    const res = await request(app)
      .put('/agents/secure/invalid-id')
      .set('Authorization', token)
      .send({ name: 'Another Name' });

    expect(res.status).toBe(400);
  });

  it('should return 404 if agent not found', async () => {
    const res = await request(app)
      .put(`/agents/secure/6c797893-3145-4c55-836a-df6449ba54f2`)
      .set('Authorization', token)
      .send({ name: 'Another Name' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /secure/agents/:agentId', () => {
//   it('should return 200 on successful deletion', async () => {
//     const res = await request(app)
//       .delete('/agents/secure/74096bb2-a0fb-47cd-abb7-f062336af3f3') // Replace with valid agent ID
//       .set('Authorization', token);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('Agent deleted');
//   });

  it('should return 400 for invalid agentId', async () => {
    const res = await request(app)
      .delete('/agents/secure/invalid-id')
      .set('Authorization', token);

    expect(res.status).toBe(400);
  });

  it('should return 404 if agent not found', async () => {
    const res = await request(app)
      .delete(`/agents/secure/6c797893-3145-4c55-836a-df6449ba54f2`)
      .set('Authorization', token);

    expect(res.status).toBe(404);
  });
});
})