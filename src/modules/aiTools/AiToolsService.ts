import { AiTool, AiToolData } from './aiTools.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';
import AiToolsRepository from './AiToolsRepository';

export default class AiToolsService {
    private repository: AiToolsRepository;
    private block = "aiTools.service"
    constructor(repository: AiToolsRepository) {
        this.repository = repository
    }

    async create(agentId: string, toolId: string): Promise<AiTool> {
        try {
            return this.repository.create(agentId, toolId);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", {agentId, toolId})
            throw error;
        }
    }

    async read(): Promise<AiToolData[]> {
        try {
            const result = await this.repository.read();
            return result.map((tool) => this.mapFromDb(tool as AiTool)) 
        } catch (error) {
            handleServiceError(error as Error, this.block, "read ", {})
            throw error;
        }
    }

    async resource(agentId: string, toolId: string): Promise<AiToolData | null> {
        try {
            const result = await this.repository.resource(agentId, toolId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {agentId, toolId})
            throw error;
        }
    }

    async collection(agentId: string): Promise<AiToolData[]> {
        try {
            const result = await this.repository.collection(agentId);

            return result.map((tool) => this.mapFromDb(tool));
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", { agentId })
            throw error;
        }
    }

 
    async delete(agentId: string, toolId: string): Promise<AiTool> {
        try {
            return await this.repository.delete(agentId, toolId) as AiTool;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {agentId, toolId})
            throw error;
        }
    }

    mapToDb(aiTool: AiToolData): AiTool {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agent_id: aiTool.agentId,
            tool_id: aiTool.toolId,
            name: aiTool.name
        }
    }

    mapFromDb(aiTool: AiTool): AiToolData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agentId: aiTool.agent_id,
            toolId: aiTool.tool_id,
            name: aiTool.name
        }
    }
}
