import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { AgentPlatform, IPlatformsRepository, Platform } from "./platforms.interface";


export default class PlatformsRepository extends BaseRepository<Platform> implements IPlatformsRepository {
    constructor(pool: Pool) {
        super(pool, "platforms")
    }

    async getAgentPlatform(agentId: string, platform: string): Promise<AgentPlatform | null> {
        const sqlRead = `
            SELECT platforms.* AS platform, agents.* AS agent
            FROM platforms
            JOIN agents ON platforms.agent_id = agents.agent_id
            WHERE platforms.agent_id = $1 AND platforms.platform = $2;
        `;

        const result = await this.pool.query(sqlRead, [agentId, platform]);

        return result.rows[0] as AgentPlatform || null;
    }
}