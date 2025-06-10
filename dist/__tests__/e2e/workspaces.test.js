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
const workspaces_routes_1 = require("../../src/modules/workspaces/workspaces.routes");
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
        const router = (0, workspaces_routes_1.initializeWorkspacesRouter)();
        app.use("/workspaces", router);
        app.use(middlewareService.handleErrors.bind(middlewareService));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
    const validWorkspaceId = "07fad1a6-8087-49a2-a107-d0c87fbbe96b";
    const invalidWorkspaceId = "not-a-uuid";
    describe("POST /workspaces/secure/create", () => {
        it("should create a workspace with valid data and token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/workspaces/secure/create")
                .set("Authorization", token)
                .send({ name: "Test Workspace" });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Workspace added.");
        }));
        it("should return 400 if name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/workspaces/secure/create")
                .set("Authorization", token)
                .send({});
            expect(res.status).toBe(400);
        }));
        it("should return 401 if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/workspaces/secure/create")
                .send({ name: "No Token Workspace" });
            expect(res.status).toBe(401);
        }));
    });
    describe("GET /workspaces/secure/resource/:workspaceId", () => {
        it("should return the workspace data if token is valid and user owns the workspace", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get(`/workspaces/secure/resource/${validWorkspaceId}`)
                .set("Authorization", token);
            console.log(res.body, "RESOURCE");
            expect(res.status).toBe(200);
        }));
        it("should return 404 if workspace is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get("/workspaces/secure/resource/00000000-0000-0000-0000-000000000000")
                .set("Authorization", token);
            expect(res.status).toBe(404);
        }));
        // it("should return 403 if workspace belongs to another user", async () => {
        //     const res = await request(app)
        //         .get(`/workspaces/secure/resource/${otherUserWorkspaceId}`)
        //         .set("Authorization", token);
        //     expect(res.status).toBe(403);
        // });
        it("should return 400 if workspaceId is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get(`/workspaces/secure/resource/${invalidWorkspaceId}`)
                .set("Authorization", token);
            expect(res.status).toBe(400);
        }));
        it("should return 401 if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get(`/workspaces/secure/resource/${validWorkspaceId}`);
            expect(res.status).toBe(401);
        }));
    });
    describe("GET /workspaces/secure/collection", () => {
        it("should return all user workspaces", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get("/workspaces/secure/collection")
                .set("Authorization", token);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        }));
        it("should return 401 if token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get("/workspaces/secure/collection");
            expect(res.status).toBe(401);
        }));
    });
    describe("Put /workspaces/secure/update/:workspaceId", () => {
        it("should update the workspace name", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put(`/workspaces/secure/${validWorkspaceId}`)
                .set("Authorization", token)
                .send({ name: "Updated Name" });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("workspace updated");
        }));
        // it("should return 403 if workspace belongs to another user", async () => {
        //     const res = await request(app)
        //         .patch(`/workspaces/secure/update/${otherUserWorkspaceId}`)
        //         .set("Authorization", token)
        //         .send({ name: "Hack Attempt" });
        //     expect(res.status).toBe(403);
        // });
        it("should return 400 for invalid workspaceId", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put(`/workspaces/secure/${invalidWorkspaceId}`)
                .set("Authorization", token)
                .send({ name: "Invalid UUID" });
            expect(res.status).toBe(400);
        }));
        it("should return 401 without token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .put(`/workspaces/secure/${validWorkspaceId}`)
                .send({ name: "No Auth" });
            expect(res.status).toBe(401);
        }));
    });
    describe("DELETE /workspaces/secure/delete/:workspaceId", () => {
        // it("should delete the workspace", async () => {
        //     const res = await request(app)
        //         .delete(`/workspaces/secure/${validWorkspaceId}`)
        //         .set("Authorization", token);
        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe("Workspace deleted");
        // });
        // it("should return 403 if workspace belongs to another user", async () => {
        //     const res = await request(app)
        //         .delete(`/workspaces/secure/delete/${otherUserWorkspaceId}`)
        //         .set("Authorization", token);
        //     expect(res.status).toBe(403);
        // });
        it("should return 400 for invalid workspaceId", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete(`/workspaces/secure/${invalidWorkspaceId}`)
                .set("Authorization", token);
            expect(res.status).toBe(400);
        }));
    });
});
