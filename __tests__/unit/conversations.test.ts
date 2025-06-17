import dotenv from 'dotenv';
dotenv.config();
import { Pool } from "pg";

import ConversationsRepositoy from '../../src/modules/conversations/ConversationsRepository';
import ConversationsService from '../../src/modules/conversations/ConversationsService';
import { serveWithOptions } from 'swagger-ui-express';
import { Conversation, ConversationData } from '../../src/modules/conversations/conversations.interface';
import { configureContainer } from '../../src/core/dependencies/configureContainer';
import Container from '../../src/core/dependencies/Container';
import { RedisClientType } from 'redis';

describe("AGENTSREPOSITORY", () => {
    let pool: Pool;
   beforeAll(async() => {
        pool  = new Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        })

       await configureContainer(pool);
    })

    afterAll(async() =>  {
        await pool.end();
        const redisClient = Container.resolve<RedisClientType>("RedisClient")
        await redisClient.quit();
        Container.clear();
        
    })
    describe("resource", () => {
        // it("should return agent info with user_id", async() => {
        //     const repo = new ConversationsRepositoy(pool);
        //     const service = new ConversationsService(repo);

        //     const data: ConversationData =  {
        //         agentId: "7a367831-5458-47be-ae3d-3b5788c56af8",
        //         platform: "messenger",
        //         messagingProduct: "direct",
        //         title: "test",
        //         clientId: "e869c44f-fed3-4887-bb31-a19bf1492b30",
        //         handoff: true
        //     }
        //     const result = await service.create(data);

        //     console.log(result, "RESULT::::::")
        //     expect(result).toHaveProperty("conversation_id");
        // })
    })

    // describe("resource", () => {
    //     it("should return agent info with user_id", async() => {
    //         const repo = new ConversationsRepositoy(pool);
    //         const service = new ConversationsService(repo);

    //         const data: ConversationData =  {
    //             agentId: "7a367831-5458-47be-ae3d-3b5788c56af8",
    //             platform: "messenger",
    //             title: "test",
    //             clientId: "e869c44f-fed3-4887-bb31-a19bf1492b30",
    //             handoff: true
    //         }
    //         const result = await service.create(data);

    //         console.log(result, "RESULT::::::")
    //         expect(result).toHaveProperty("conversation_id");
    //     })
    // })

     describe("resource", () => {
        it("should return agent info with user_id", async() => {
            const repo = new ConversationsRepositoy(pool);
            const service = new ConversationsService(repo);

           
            const result = await service.getAPIData("9c00d775-c78f-496c-aad5-2814fdef0ff0");

            console.log(result, "RESULT::::::")
            expect(result).toHaveProperty("agent_id");
        })
    })
})