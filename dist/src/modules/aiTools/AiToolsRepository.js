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
Object.defineProperty(exports, "__esModule", { value: true });
class AiToolsRepository {
    constructor(pool) {
        this.pool = pool;
    }
    create(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlInsert = `
            INSERT INTO ai_tools (
                agent_id,
                tool_id
            ) VALUES ($1, $2)
            RETURNING *;
        `;
            const result = yield this.pool.query(sqlInsert, [agentId, toolId]);
            return result.rows[0];
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT * FROM tools
        `;
            const result = yield this.pool.query(sqlRead);
            return result.rows;
        });
    }
    resource(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT ai_tools.*, tools.name AS name
            FROM ai_tools
            JOIN tools ON ai_tools.tool_id = tools.tool_id
            WHERE ai_tools.agent_id = $1 AND ai_tools.tool_id = $2;
        `;
            const result = yield this.pool.query(sqlRead, [agentId, toolId]);
            return result.rows[0] || null;
        });
    }
    collection(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT ai_tools.*, tools.name AS name
            FROM ai_tools
            JOIN tools ON ai_tools.tool_id = tools.tool_id
            WHERE ai_tools.agent_id;
        `;
            const result = yield this.pool.query(sqlRead, [agentId]);
            return result.rows;
        });
    }
    delete(agentId, toolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlDelete = `
            DELETE FROM ai_tooLs
            WHERE ai_tools.agent_id = $1 AND ai_tools.tool_id = $2
            RETURNING *;
        `;
            const result = yield this.pool.query(sqlDelete, [agentId, toolId]);
            return result.rows[0];
        });
    }
}
exports.default = AiToolsRepository;
