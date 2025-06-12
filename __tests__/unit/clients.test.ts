import dotenv from 'dotenv';
dotenv.config();
import { Pool } from "pg";
import { AgentsRepository } from "../../src/modules/agents/AgentsRepository";
import ConversationsRepositoy from '../../src/modules/conversations/ConversationsRepository';
import ConversationsService from '../../src/modules/conversations/ConversationsService';
import { serveWithOptions } from 'swagger-ui-express';
import { Conversation, ConversationData } from '../../src/modules/conversations/conversations.interface';
import BaseRepository from '../../src/core/repository/BaseRepository';
import { Client, ClientData } from '../../src/modules/clients/clients.interface';
import ClientService from '../../src/modules/clients/ClientsService';
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
        it("should return agent info with user_id", async() => {
            const repo = new BaseRepository<Client>(pool, "clients");
            const service = new ClientService(repo);

            const data: ClientData =  {
                agentId: "7a367831-5458-47be-ae3d-3b5788c56af8",
                name: "julio",
                contactIdentifier: "7738851711"
            }
            const result = await service.create(data);

            console.log(result, "RESULT::::::")
            expect(result).toHaveProperty("client_id");
        })
    })
})