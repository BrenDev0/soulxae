import dotenv from 'dotenv';
dotenv.config();
import { Pool } from "pg";
import { AgentsRepository } from "../../src/modules/agents/AgentsRepository";

describe("AGENTSREPOSITORY", () => {
    let pool: Pool;
   beforeAll(async() => {
    pool  = new Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        })

       
    })

    afterAll(async() =>  {
        await pool.end();        
    })

    describe("resource", () => {
        it("should return agent info with user_id", async() => {
            const repo = new AgentsRepository(pool);
            const result = await repo.resource("7a367831-5458-47be-ae3d-3b5788c56af8");

            console.log(result, "RESULT::::::")
            expect(result).toHaveProperty("user_id");
        })
    })

    describe("collection", () => {
        it("should return agents info with user_id", async() => {
            const repo = new AgentsRepository(pool);
            const result = await repo.collection("6c797893-3145-4c55-836a-df6449ba54f2");

            console.log(result, "RESULT::::::")
            expect(result[0]).toHaveProperty("user_id");
        })
    })
})