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

        const router = initializeWorkspacesRouter();

        app.use("/workspaces", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })
    const validWorkspaceId = "07fad1a6-8087-49a2-a107-d0c87fbbe96b";
   
    const invalidWorkspaceId = "not-a-uuid";

    describe("POST /workspaces/secure/create", () => {
    it("should create a workspace with valid data and token", async () => {
        const res = await request(app)
            .post("/workspaces/secure/create")
            .set("Authorization", token)
            .send({ name: "Test Workspace" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Workspace added.");
    });

    it("should return 400 if name is missing", async () => {
        const res = await request(app)
            .post("/workspaces/secure/create")
            .set("Authorization", token)
            .send({});

        expect(res.status).toBe(400);
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app)
            .post("/workspaces/secure/create")
            .send({ name: "No Token Workspace" });

        expect(res.status).toBe(401);
    });
});

describe("GET /workspaces/secure/resource/:workspaceId", () => {
    it("should return the workspace data if token is valid and user owns the workspace", async () => {
        const res = await request(app)
            .get(`/workspaces/secure/resource/${validWorkspaceId}`)
            .set("Authorization", token);

            console.log(res.body, "RESOURCE")
        expect(res.status).toBe(200);
    });

    it("should return 404 if workspace is not found", async () => {
        const res = await request(app)
            .get("/workspaces/secure/resource/00000000-0000-0000-0000-000000000000")
            .set("Authorization", token);

        expect(res.status).toBe(404);
    });

    // it("should return 403 if workspace belongs to another user", async () => {
    //     const res = await request(app)
    //         .get(`/workspaces/secure/resource/${otherUserWorkspaceId}`)
    //         .set("Authorization", token);

    //     expect(res.status).toBe(403);
    // });

    it("should return 400 if workspaceId is invalid", async () => {
        const res = await request(app)
            .get(`/workspaces/secure/resource/${invalidWorkspaceId}`)
            .set("Authorization", token);

        expect(res.status).toBe(400);
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app)
            .get(`/workspaces/secure/resource/${validWorkspaceId}`);

        expect(res.status).toBe(401);
    });
});

describe("GET /workspaces/secure/collection", () => {
    it("should return all user workspaces", async () => {
        const res = await request(app)
            .get("/workspaces/secure/collection")
            .set("Authorization", token);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 401 if token is missing", async () => {
        const res = await request(app)
            .get("/workspaces/secure/collection");

        expect(res.status).toBe(401);
    });
});

describe("Put /workspaces/secure/update/:workspaceId", () => {
    it("should update the workspace name", async () => {
        const res = await request(app)
            .put(`/workspaces/secure/${validWorkspaceId}`)
            .set("Authorization", token)
            .send({ name: "Updated Name" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("workspace updated");
    });

    // it("should return 403 if workspace belongs to another user", async () => {
    //     const res = await request(app)
    //         .patch(`/workspaces/secure/update/${otherUserWorkspaceId}`)
    //         .set("Authorization", token)
    //         .send({ name: "Hack Attempt" });

    //     expect(res.status).toBe(403);
    // });

    it("should return 400 for invalid workspaceId", async () => {
        const res = await request(app)
            .put(`/workspaces/secure/${invalidWorkspaceId}`)
            .set("Authorization", token)
            .send({ name: "Invalid UUID" });

        expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
        const res = await request(app)
            .put(`/workspaces/secure/${validWorkspaceId}`)
            .send({ name: "No Auth" });

        expect(res.status).toBe(401);
    });
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

    it("should return 400 for invalid workspaceId", async () => {
        const res = await request(app)
            .delete(`/workspaces/secure/${invalidWorkspaceId}`)
            .set("Authorization", token);

        expect(res.status).toBe(400);
    });

    })
})
