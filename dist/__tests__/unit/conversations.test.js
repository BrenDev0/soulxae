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
dotenv_1.default.config();
const pg_1 = require("pg");
const ConversationsRepository_1 = __importDefault(require("../../src/modules/conversations/ConversationsRepository"));
const ConversationsService_1 = __importDefault(require("../../src/modules/conversations/ConversationsService"));
const configureContainer_1 = require("../../src/core/dependencies/configureContainer");
const Container_1 = __importDefault(require("../../src/core/dependencies/Container"));
describe("AGENTSREPOSITORY", () => {
    let pool;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        pool = new pg_1.Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });
        yield (0, configureContainer_1.configureContainer)(pool);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
        const redisClient = Container_1.default.resolve("RedisClient");
        yield redisClient.quit();
        Container_1.default.clear();
    }));
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
    });
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
        it("should return agent info with user_id", () => __awaiter(void 0, void 0, void 0, function* () {
            const repo = new ConversationsRepository_1.default(pool);
            const service = new ConversationsService_1.default(repo);
            const result = yield service.getAPIData("9c00d775-c78f-496c-aad5-2814fdef0ff0");
            console.log(result, "RESULT::::::");
            expect(result).toHaveProperty("agent_id");
        }));
    });
});
