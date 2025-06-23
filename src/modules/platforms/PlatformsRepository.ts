import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { IPlatformsRepository, Platform, PlatformPrivate } from "./platforms.interface";


export default class PlatformsRepository extends BaseRepository<Platform> implements IPlatformsRepository {
    constructor(pool: Pool) {
        super(pool, "platforms")
    }

    async getPlatformByAgentId(agentId: string, platform: string): Promise<PlatformPrivate| null> {
        const sqlRead = `
            SELECT platforms.token, platforms.identifier, platforms.platform_id, platforms.webhook_secret, agents.type as agent_type, agents.user_id
            FROM platforms
            JOIN agents ON platforms.agent_id = agents.agent_id
            WHERE platforms.agent_id = $1 AND platforms.platform = $2;
        `;

        const result = await this.pool.query(sqlRead, [agentId, platform]);

        return result.rows[0] as PlatformPrivate || null;
    }
}