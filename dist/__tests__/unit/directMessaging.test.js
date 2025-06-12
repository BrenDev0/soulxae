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
const directMessaging_routes_1 = require("../../src/modules/directMessaging/directMessaging.routes");
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
        const router = (0, directMessaging_routes_1.initializeDirectMessageingRouter)();
        app.use("/direct", router);
        app.use(middlewareService.handleErrors.bind(middlewareService));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
    describe('POST /direct/secure/send', () => {
        it('should return 200 and add a new agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/direct/secure/send')
                .set('Authorization', token)
                .send({
                message: {
                    conversationId: "29bbc5a6-64c9-4d21-adca-b8fae2b9f43b",
                    content: {
                        header: {
                            type: "image",
                            image: "https://blogs-app.s3.us-east-1.amazonaws.com/images/15/67/blog_image_1.png"
                        },
                        body: "hello form jest2",
                        footer: null,
                        buttons: null
                    }
                }
            });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Message sent');
        }));
        it('should return 200 and add a new agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`https://graph.facebook.com/v23.0/738288961978853`)
                .set('Authorization', token);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Message sent');
        }));
    });
});
