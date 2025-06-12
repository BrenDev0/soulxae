import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Conversation, ConversationData, ConversationForAPI, IConversationsRepository } from "./conversations.interface";

export default class ConversationsRepositoy extends BaseRepository<Conversation> implements IConversationsRepository {
    constructor(pool: Pool) {
        super(pool, "conversations") 
    }

    async getAPIData(conversationId: string): Promise<ConversationForAPI | null> {
        const sqlRead = `
            SELECT conversations.*, platforms.identifier AS platform_identifier, clients.contact_identifier AS client_identifier
            FROM conversations
            JOIN platforms ON conversations.platform = platforms.platform AND conversations.agent_id = platforms.agent_id
            JOIN clients ON conversations.client_id = clients.client_id
            WHERE conversations.conversation_id = $1;
        `
        const result = await this.pool.query(sqlRead, [conversationId]);

        return result.rows[0] as ConversationForAPI || null;
    }
}