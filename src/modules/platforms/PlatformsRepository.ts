import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { IPlatformsRepository, Platform } from "./platforms.interface";


export default class PlatformsRepository extends BaseRepository<Platform> implements IPlatformsRepository {
    constructor(pool: Pool) {
        super(pool, "platforms")
    }

    async getPlatformByAgentId(agentId: string, platform: string): Promise<Platform| null> {
        const sqlRead = `
            SELECT *
            FROM platforms
            WHERE agent_id = $1 AND platform = $2;
        `;

        const result = await this.pool.query(sqlRead, [agentId, platform]);

        return result.rows[0] as Platform || null;
    }
}