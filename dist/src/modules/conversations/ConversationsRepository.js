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
const BaseRepository_1 = __importDefault(require("../../core/repository/BaseRepository"));
class ConversationsRepositoy extends BaseRepository_1.default {
    constructor(pool) {
        super(pool, "conversations");
    }
    getAPIData(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT conversations.conversation_id, platforms.identifier AS platform_identifier, platforms.token, platforms.platform AS platform, clients.contact_identifier AS client_identifier
            FROM conversations
            JOIN platforms ON conversations.platform_id = platforms.platform_id
            JOIN clients ON conversations.client_id = clients.client_id
            WHERE conversations.conversation_id = $1;
        `;
            const result = yield this.pool.query(sqlRead, [conversationId]);
            return result.rows[0] || null;
        });
    }
    findByIds(agentId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT * FROM conversations
            WHERE platform_id = $1 AND client_id = $2;    
        `;
            const result = yield this.pool.query(sqlRead, [agentId, clientId]);
            return result.rows[0] || null;
        });
    }
    getS3BucketKeyData(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRead = `
            SELECT conversations.conversation_id, platforms.platform_id, agents.agent_id, workspaces.workspace_id, users.user_id
            FROM conversations
            JOIN platforms ON conversations.platform_id = platforms.platform_id
            JOIN agents ON platforms.agent_id = agents.agent_id
            JOIN workspaces ON agents.workspace_id = workspaces.workspace_id
            JOIN users ON workspaces.user_id = users.user_id
            WHERE conversations.conversation_id = $1;
        `;
            const result = yield this.pool.query(sqlRead, [conversationId]);
            return result.rows[0] || null;
        });
    }
}
exports.default = ConversationsRepositoy;
