import { Agent, AgentData } from './agents.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';
import { AgentsRepository } from './AgentsRepository';

export default class AgentService {
    private repository: AgentsRepository;
    private block = "agents.service"
    constructor(repository: AgentsRepository) {
        this.repository = repository
    }

    async create(agents: AgentData): Promise<Agent> {
        const mappedAgent = this.mapToDb(agents);
        try {
            return this.repository.create(mappedAgent);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedAgent)
            throw error;
        }
    }

    async resource(agentId: string): Promise<AgentData | null> {
        try {
            const result = await this.repository.resource(agentId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {agentId})
            throw error;
        }
    }

     async collection(workspaceId: string): Promise<AgentData[]> {
        try {
            const result = await this.repository.collection(workspaceId);

            const data = result.map((agent) => this.mapFromDb(agent));
            
            return data
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {workspaceId})
            throw error;
        }
    }

    async update(agentId: string, changes: AgentData): Promise<Agent> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("agent_id", agentId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(agentId: string): Promise<Agent> {
        try {
            return await this.repository.delete("agent_id", agentId) as Agent;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {agentId})
            throw error;
        }
    }

    mapToDb(agent: AgentData): Agent {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agent_type: agent.agentType.toLowerCase(),
           workspace_id: agent.workspaceId,
           api_key: agent.apiKey && encryptionService.encryptData(agent.apiKey),
           name: agent.name,
           description: agent.description
        }
    }

    mapFromDb(agent: Agent): AgentData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agentId: agent.agent_id,
            agentType: agent.agent_type.toLowerCase(),
            workspaceId: agent.workspace_id,
            apiKey: agent.api_key === null ? null : encryptionService.decryptData(agent.api_key),
            name: agent.name,
            description: agent.description,
            userId: agent.user_id
        }
    }
}
