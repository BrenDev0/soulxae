import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Conversation, ConversationData, ConversationForAPI, IConversationsRepository } from "./conversations.interface";

export default class ConversationsRepositoy extends BaseRepository<Conversation> implements IConversationsRepository {
    constructor(pool: Pool) {
        super(pool, "conversations") 
    }

    async getAPIData(conversationId: string): Promise<ConversationForAPI | null> {
        const sqlRead = `
            SELECT conversations.conversation_id, platforms.identifier AS platform_identifier, platforms.token, platforms.platform AS platform clients.contact_identifier AS client_identifier
            FROM conversations
            JOIN platforms ON conversations.platform_id = platforms.platform_id
            JOIN clients ON conversations.client_id = clients.client_id
            WHERE conversations.conversation_id = $1;
        `
        const result = await this.pool.query(sqlRead, [conversationId]);

        return result.rows[0] as ConversationForAPI || null;
    }

    async findByIds(agentId: string, clientId: string): Promise<Conversation | null> {
        const sqlRead = `
            SELECT * FROM conversations
            WHERE agent_id = $1 AND client_id = $2;    
        `

        const result = await this.pool.query(sqlRead, [agentId, clientId]);

        return result.rows[0] as Conversation || null;
    }
}