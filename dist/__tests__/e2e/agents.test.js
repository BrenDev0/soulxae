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
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const createApp_1 = __importDefault(require("../../src/createApp"));
const supertest_1 = __importDefault(require("supertest"));
const Container_1 = __importDefault(require("../../src/core/dependencies/Container"));
const configureContainer_1 = require("../../src/core/dependencies/configureContainer");
const agents_routes_1 = require("../../src/modules/agents/agents.routes");
dotenv_1.default.config();
describe("USERS ROUTES", () => {
    let app;
    let pool;
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmN2ZmZC1lOTRmLTRmNTktYTc2ZS05ZDcwMDAyM2ZiYTIiLCJpYXQiOjE3NDk1ODEwNTksImV4cCI6MTc4MTExNzA1OX0.S6WoYU-CatNXRb7fq5Xvs39SJ8udLBD4HB8db1-WhxQ";
    const verificationToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25Db2RlIjoxMjM0NTYsImlhdCI6MTc0OTU4MTY2MSwiZXhwIjoxNzgxMTE3NjYxfQ.gBXDKWjdTXn3VBZWoagZyyprqHBQnV1_IUFXsMGRDb8";
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        pool = new pg_1.Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });
        app = (0, createApp_1.default)();
        yield (0, configureContainer_1.configureContainer)(pool);
        const middlewareService = Container_1.default.resolve("MiddlewareService");
        const router = (0, agents_routes_1.initializeAgentsRouter)();
        app.use("/agents", router);
        app.use(middlewareService.handleErrors.bind(middlewareService));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
    describe('POST /agents/secure/create', () => {
        it('should return 200 and add a new agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
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
        }));
        it('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/agents/secure/create')
                .set('Authorization', token)
                .send({});
            expect(res.status).toBe(400);
        }));
        it('should return 404 for invalid workspace', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
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
        }));
    });
    describe('GET /agents/secure/resource/:agentId', () => {
        it('should return 200 and agent data', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/agents/secure/resource/48397e4a-68e3-44a2-83b6-6645c5c4b7a1') // Replace with actual valid agent ID
                .set('Authorization', token);
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('name');
        }));
        it('should return 400 for invalid UUID', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/agents/secure/resource/invalid-id')
                .set('Authorization', token);
            expect(res.status).toBe(400);
        }));
        it('should return 404 for non-existent agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get(`/agents/secure/resource/6c797893-3145-4c55-836a-df6449ba54f2`)
                .set('Authorization', token);
            expect(res.status).toBe(404);
        }));
    });
    describe('GET /agents/secure/collection/:workspaceId', () => {
        it('should return 200 and agent list', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/agents/secure/collection/6c797893-3145-4c55-836a-df6449ba54f2') // Replace with actual workspace ID
                .set('Authorization', token);
            console.log(res.body, "CollectionSuccess::::::: ");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        }));
        it('should return 400 for invalid workspaceId format', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/agents/secure/collection/abc')
                .set('Authorization', token);
            expect(res.status).toBe(400);
        }));
        it('should return 404 if workspace not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get(`/agents/secure/collection/6c797893-3145-4c55-836a-df6449ba54f9`)
                .set('Authorization', token);
            console.log(res.body, "Collection");
            expect(res.status).toBe(404);
        }));
    });
    describe('PUT /secure/agents/:agentId', () => {
        it('should return 200 on successful update', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put('/agents/secure/48397e4a-68e3-44a2-83b6-6645c5c4b7a1') // Replace with actual ID
                .set('Authorization', token)
                .send({ name: 'Updated Agent Name' });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('updated');
        }));
        it('should return 400 for invalid agentId format', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put('/agents/secure/invalid-id')
                .set('Authorization', token)
                .send({ name: 'Another Name' });
            expect(res.status).toBe(400);
        }));
        it('should return 404 if agent not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put(`/agents/secure/6c797893-3145-4c55-836a-df6449ba54f2`)
                .set('Authorization', token)
                .send({ name: 'Another Name' });
            expect(res.status).toBe(404);
        }));
    });
    describe('DELETE /secure/agents/:agentId', () => {
        //   it('should return 200 on successful deletion', async () => {
        //     const res = await request(app)
        //       .delete('/agents/secure/74096bb2-a0fb-47cd-abb7-f062336af3f3') // Replace with valid agent ID
        //       .set('Authorization', token);
        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe('Agent deleted');
        //   });
        it('should return 400 for invalid agentId', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete('/agents/secure/invalid-id')
                .set('Authorization', token);
            expect(res.status).toBe(400);
        }));
        it('should return 404 if agent not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete(`/agents/secure/6c797893-3145-4c55-836a-df6449ba54f2`)
                .set('Authorization', token);
            expect(res.status).toBe(404);
        }));
    });
});
