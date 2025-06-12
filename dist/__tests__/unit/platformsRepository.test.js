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
const PlatformsRepository_1 = __importDefault(require("../../src/modules/platforms/PlatformsRepository"));
describe("PLATFORMSREPOSITORY", () => {
    let pool;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        pool = new pg_1.Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
    }));
    describe("resource", () => {
        it("should return agent info with user_id", () => __awaiter(void 0, void 0, void 0, function* () {
            const repo = new PlatformsRepository_1.default(pool);
            const result = yield repo.getAgentPlatform("7a367831-5458-47be-ae3d-3b5788c56af8", "whatsapp");
            console.log(result, "RESULT::::::");
            expect(result).toHaveProperty("agent_id");
        }));
        it("should return null", () => __awaiter(void 0, void 0, void 0, function* () {
            const repo = new PlatformsRepository_1.default(pool);
            const result = yield repo.getAgentPlatform("7a367831-5458-47be-ae3d-3b5788c56af8", "direct");
            console.log(result, "RESULT::::::");
            expect(result).toBe(null);
        }));
    });
    // describe("collection", () => {
    //     it("should return agents info with user_id", async() => {
    //         const repo = new PlatformsRepository(pool);
    //         const result = await repo.collection("6c797893-3145-4c55-836a-df6449ba54f2");
    //         console.log(result, "RESULT::::::")
    //         expect(result[0]).toHaveProperty("user_id");
    //     })
    // })
});
