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
        // it('should send image message', async () => {
        //   const res = await request(app)
        //     .post('/direct/secure/send')
        //     .set('Authorization', token)
        //     .send({
        //           conversationId: conversationId,
        //           type: "image",
        //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/6c797893-3145-4c55-836a-df6449ba54f2/c352ab7c-94af-4944-9e3f-ea47b5515906/682ada70-15f8-45ff-98ed-714868b31bdc/1792023d-7e24-44a7-8c4a-aa3d55282a25/image/jpeg/1085168556809467"],
        //           mediaType: "image/jpeg"
        //     });
        //   expect(res.status).toBe(200);
        //   expect(res.body.message).toBe('Message sent');
        // });
        // it('should send audio message', async () => {
        //   const res = await request(app)
        //     .post('/direct/secure/send')
        //     .set('Authorization', token)
        //     .send({
        //           conversationId: conversationId,
        //           type: "audio",
        //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/audio/ogg/1959631054845857"],
        //           mediaType: "audio/ogg"
        //     });
        //     console.log(res.body)
        //   expect(res.status).toBe(200);
        //   expect(res.body.message).toBe('Message sent');
        // });
        it('should send text message ', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/direct/secure/send')
                .set('Authorization', token)
                .send({
                conversationId: conversationId,
                type: "text",
                text: "hello from jest"
            });
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Message sent');
        }));
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
        //  it('should send video message', async () => {
        //   const res = await request(app)
        //     .post('/direct/secure/send')
        //     .set('Authorization', token)
        //     .send({
        //         conversationId: conversationId,
        //         type: "video",
        //         media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/video/mp4/1610303579644893"],
        //         mediaType: "video/mp4"
        //     });
        //     console.log(res.body)
        //   expect(res.status).toBe(200);
        //   expect(res.body.message).toBe('Message sent');
        // });
        //  it('should send video message with text', async () => {
        //   const res = await request(app)
        //     .post('/direct/secure/send')
        //     .set('Authorization', token)
        //     .send({
        //           conversationId: conversationId,
        //           type: "video",
        //           media: ["https://soulxae-imagenes.s3.us-east-1.amazonaws.com/66cf7ffd-e94f-4f59-a76e-9d700023fba2/42750558-27ab-445c-b1b1-dced31059fd9/16249d6f-63f4-40d9-b51d-03f92190ce83/cc398f74-0fdc-4c23-b2c9-50128858f484/video/mp4/1610303579644893"],
        //           mediaType: "video/mp4",
        //           text: "video with text"
        //     });
        //     console.log(res.body)
        //   expect(res.status).toBe(200);
        //   expect(res.body.message).toBe('Message sent');
        // });
    });
});
