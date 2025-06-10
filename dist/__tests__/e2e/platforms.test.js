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
const platforms_routes_1 = require("../../src/modules/platforms/platforms.routes");
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
        const router = (0, platforms_routes_1.initializePlatformsRouter)();
        app.use("/platforms", router);
        app.use(middlewareService.handleErrors.bind(middlewareService));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
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
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/platforms/secure/create')
                .set('Authorization', token)
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBeDefined();
        }));
    });
    describe('GET /platforms/secure/resource/:platformId', () => {
        it('should return 200 and platform data for valid platformId', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/platforms/secure/resource/ab3883b1-4fa6-404e-92cc-95bbae57cf54')
                .set('Authorization', token);
            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        }));
        it('should return 400 for invalid platformId format', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/platforms/secure/resource/invalid-id')
                .set('Authorization', token);
            expect(res.status).toBe(400);
        }));
        it('should return 404 if platform is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/platforms/secure/resource/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
                .set('Authorization', token);
            expect(res.status).toBe(404);
        }));
    });
    describe('PUT /platforms/secure/:platformId', () => {
        it('should return 200 and message when platform is updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put('/platforms/secure/ab3883b1-4fa6-404e-92cc-95bbae57cf54')
                .set('Authorization', token)
                .send({
                token: 'updated-token',
                platform: 'instagram'
            });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('updated');
        }));
        it('should return 400 for invalid platformId format', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put('/platforms/secure/invalid-id')
                .set('Authorization', token)
                .send({ token: 'some-token' });
            expect(res.status).toBe(400);
        }));
        it('should return 404 if platform not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
                .set('Authorization', token)
                .send({ token: 'some-token' });
            expect(res.status).toBe(404);
        }));
    });
    describe('DELETE /platforms/secure/:platformId', () => {
        //   it('should return 200 and message when platform is deleted', async () => {
        //     const res = await request(app)
        //       .delete('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a10')
        //       .set('Authorization', token);
        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe('Platform deleted');
        //   });
        it('should return 400 for invalid platformId format', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete('/platforms/secure/invalid-id')
                .set('Authorization', token);
            expect(res.status).toBe(400);
        }));
        it('should return 404 if platform not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete('/platforms/secure/cc2bc81e-3f27-44a2-a2f2-5fd18bb69a1a')
                .set('Authorization', token);
            expect(res.status).toBe(404);
        }));
    });
});
