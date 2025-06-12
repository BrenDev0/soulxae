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
const BaseRepository_1 = __importDefault(require("../../src/core/repository/BaseRepository"));
const ClientsService_1 = __importDefault(require("../../src/modules/clients/ClientsService"));
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
        it("should return agent info with user_id", () => __awaiter(void 0, void 0, void 0, function* () {
            const repo = new BaseRepository_1.default(pool, "clients");
            const service = new ClientsService_1.default(repo);
            const data = {
                agentId: "7a367831-5458-47be-ae3d-3b5788c56af8",
                name: "julio",
                contactIdentifier: "7738851711"
            };
            const result = yield service.create(data);
            console.log(result, "RESULT::::::");
            expect(result).toHaveProperty("client_id");
        }));
    });
});
