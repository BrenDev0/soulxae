import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Agent, IAgentsRepository } from "./agents.interface";

export class AgentsRepository extends BaseRepository<Agent> implements IAgentsRepository {
    constructor(pool: Pool) {
        super(pool, "agents")
    }

    async resource(agentId: string): Promise<Agent | null> {
        const sqlRead = `
            SELECT agents.*, workspaces.user_id AS user_id
            from agents
            JOIN workspaces ON agents.workspace_id = workspaces.workspace_id
            WHERE agents.agent_id = $1;
        `
        const result = await this.pool.query(sqlRead, [agentId])

        return result.rows[0] || null;
    }

    async collection(workspaceId: string): Promise<Agent[]> {
        const sqlRead = `
            SELECT agents.*, workspaces.user_id AS user_id
            from agents
            JOIN workspaces ON agents.workspace_id = workspaces.workspace_id
            WHERE agents.workspace_id = $1;
        `
        const result = await this.pool.query(sqlRead, [workspaceId])

        return result.rows
    }
}