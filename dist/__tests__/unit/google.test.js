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
const google_calendar_routes_1 = require("../../src/modules/google/calendar/google.calendar.routes");
dotenv_1.default.config();
describe("USERS ROUTES", () => {
    let app;
    let pool;
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmN2ZmZC1lOTRmLTRmNTktYTc2ZS05ZDcwMDAyM2ZiYTIiLCJpYXQiOjE3NDk1ODEwNTksImV4cCI6MTc4MTExNzA1OX0.S6WoYU-CatNXRb7fq5Xvs39SJ8udLBD4HB8db1-WhxQ";
    const verificationToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25Db2RlIjoxMjM0NTYsImlhdCI6MTc0OTU4MTY2MSwiZXhwIjoxNzgxMTE3NjYxfQ.gBXDKWjdTXn3VBZWoagZyyprqHBQnV1_IUFXsMGRDb8";
    const conversationId = "4073cb49-3d49-461a-9ca4-e3f3277f6568";
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
        const router = (0, google_calendar_routes_1.initializeGoogleCalendarRouter)();
        app.use("/google/calendars", router);
        app.use(middlewareService.handleErrors.bind(middlewareService));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
    describe("GET EVENTS", () => {
        it("should  return calendar events", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get('/google/calendars/secure/events/a9698530-99e0-4d6b-9f5d-3fddddc6b4ba')
                .set('Authorization', token);
            console.log(res.body, "RESPONSE::::::::::::::");
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('data');
        }));
    });
});
