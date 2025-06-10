import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Express } from 'express';
import createApp from '../../src/createApp';
import request  from 'supertest';
import Container from '../../src/core/dependencies/Container';
import MiddlewareService from '../../src/core/middleware/MiddlewareService';
import { initializeUsersRouter } from '../../src/modules/users/users.routes';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import { RedisClientType } from 'redis';
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

        const router = initializeUsersRouter();

        app.use("/users", router)

        app.use(middlewareService.handleErrors.bind(middlewareService))
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })

    

     describe("POST /users/verify-email", () => {
        // it("should return 200 and token when email is valid and not in use", async () => {
        //     const res = await request(app)
        //         .post("/users/verify-email")
        //         .send({ email: "brendan.soullens@gmail.com" });

        //     expect(res.status).toBe(200);
        //     expect(res.body.token).toBeDefined();
        // });

        it("should return 400 if email is missing", async () => {
            const res = await request(app)
                .post("/users/verify-email")
                .send({});

            expect(res.status).toBe(400);
        });

        // it("should return 400 if email is already in use", async () => {
        //     const res = await request(app)
        //         .post("/users/verify-email")
        //         .send({ email: "existing@example.com" });

        //     expect(res.status).toBe(400);
        // });
    });

    describe("POST /users/verified/create", () => {
        // it("should create a user and return 200", async () => {
        //     const res = await request(app)
        //         .post("/users/verified/create")
        //         .set("Authorization", verificationToken)
        //         .send({
        //             code: 123456,
        //             email: "test@gmail222.com",
        //             password: "carpincha",
        //             phone: "1234567890",
        //             name: "Create User"
        //         });

        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe("User added.");
        // });

        it("should return 400 if any required field is missing", async () => {
            const res = await request(app)
                .post("/users/verified/create")
                .set("Authorization", verificationToken)
                .send({ email: "fail@example.com", code: 123456 }); // Incomplete payload

            expect(res.status).toBe(400);
        });
    });

    describe("GET /users/secure/resource", () => {
        it("should return current user data if token is valid", async () => {
            const res = await request(app)
                .get("/users/secure/resource")
                .set("Authorization", token);

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    describe("PUT /users/secure/account", () => {
        // it("should update user info and return 200", async () => {
        //     const res = await request(app)
        //         .put("/users/secure/account")
        //         .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0ODU1NjQ4MiwiZXhwIjoxNzgwMDkyNDgyfQ.da-NLsiJucB-5Npb3cmGUJ4bN8NVbp8EZ8ecNH3oa3g")
        //         .send({ name: "Updated Name", phone: "1112223333" });

        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe("User updated");
        // });

        it("should return 400 if trying to update password without oldPassword", async () => {
            const res = await request(app)
                .put("/users/secure/account")
                .set("Authorization", token)
                .send({ password: "newpass123" });

            expect(res.status).toBe(400);
        });
    });

    describe("PUT /users/verified/account", () => {
        // it("should update user with verification and return 200", async () => {
        //     const res = await request(app)
        //         .put("/users/verified/account/3")
        //         .set("Authorization", verificationToken)
        //         .send({
        //             code: 123456,
        //             email: "updated@example.com",
        //             password: "verifiedPass123"
        //         });

        //     expect(res.status).toBe(200);
        //     expect(res.body.message).toBe("User updated");
        // });

        it("should return 400 for invalid userId", async () => {
            const res = await request(app)
                .put("/users/verified/account/abc")
                .set("Authorization", verificationToken)
                .send({
                    email: "updated@example.com",
                    code: 123456
                });

            expect(res.status).toBe(400);
        });
    });

    // describe("DELETE /users/secure/delete", () => {
    //     it("should delete user and return 200", async () => {
    //         const res = await request(app)
    //             .delete("/users/secure/delete")
    //             .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0ODU1NjQ4MiwiZXhwIjoxNzgwMDkyNDgyfQ.da-NLsiJucB-5Npb3cmGUJ4bN8NVbp8EZ8ecNH3oa3g");

    //         expect(res.status).toBe(200);
    //         expect(res.body.message).toBe("User Deleted");
    //     });
    // });

    describe("POST /users/account-recovery", () => {
        // it("should send recovery email and return token", async () => {
        //     const res = await request(app)
        //         .post("/users/account-recovery")
        //         .send({ email: "brendan.soullens@gmail.com" });

        //     expect(res.status).toBe(200);
        //     expect(res.body.token).toBeDefined();
        // });

        it("should return 400 if email does not exist", async () => {
            const res = await request(app)
                .post("/users/account-recovery")
                .send({ email: "nonexistent@example.com" });

            expect(res.status).toBe(400);
        });
    });


    describe("POST /users/login", () => {
        const testEmail = "brendan.soullens@gmail.com"
        const testPassword = "carpincha"

        it('should return 400 if email is missing', async () => {
            const res = await request(app).post("/users/login").send({ password: testPassword });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('All fields required');
        });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post("/users/login").send({ email: testEmail });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All fields required');
  });

  it('should return 400 if user does not exist', async () => {
    const res = await request(app).post("/users/login").send({
      email: 'nonexistent@example.com',
      password: 'irrelevant'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Incorrect email or password');
  });

  it('should return 400 if password is incorrect', async () => {
    const res = await request(app).post("/users/login").send({
      email: testEmail,
      password: 'WrongPassword123!'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Incorrect email or password');
  });

  it('should return 200 and a token for valid credentials', async () => {
    const res = await request(app).post("/users/login").send({
      email: "test@gmail222.com",
      password: "carpincha"
    });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });
    })
})