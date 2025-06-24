import { Pool } from "pg";
import { AiTool, IAiToolsRepository } from "./aiTools.interface";

export default class AiToolsRepository implements IAiToolsRepository {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool
    }

    async create(agentId: string, toolId: string): Promise<AiTool> {
        const sqlInsert = `
            INSERT INTO ai_tools (
                agent_id,
                tool_id
            ) VALUES ($1, $2)
            RETURNING *;
        `    

        const  result = await this.pool.query(sqlInsert, [agentId, toolId])

        return result.rows[0];
    }

    async read(): Promise<Omit<AiTool, "agent_id">[]> {
        const sqlRead = `
            SELECT * FROM tools
        `

        const result = await this.pool.query(sqlRead);
        return result.rows
    }

    async resource(agentId: string, toolId: string): Promise<AiTool | null> {
        const sqlRead = `
            SELECT ai_tools.*, tools.name AS name
            FROM ai_tools
            JOIN tools ON ai_tools.tool_id = tools.tool_id
            WHERE ai_tools.agent_id = $1 AND ai_tools.tool_id = $2;
        `
        const result = await this.pool.query(sqlRead, [agentId, toolId]);

        return result.rows[0] as AiTool || null
    }

    async collection(agentId: string): Promise<AiTool[]> {
        const sqlRead = `
            SELECT ai_tools.*, tools.name AS name
            FROM ai_tools
            JOIN tools ON ai_tools.tool_id = tools.tool_id
            WHERE ai_tools.agent_id = $1;
        `
        const result = await this.pool.query(sqlRead, [agentId]);

        return result.rows
    }

    async delete(agentId: string, toolId: string): Promise<AiTool> {
         const sqlDelete = `
            DELETE FROM ai_tooLs
            WHERE ai_tools.agent_id = $1 AND ai_tools.tool_id = $2
            RETURNING *;
        `
        const result = await this.pool.query(sqlDelete, [agentId, toolId]);

        return result.rows[0] 
    }
}