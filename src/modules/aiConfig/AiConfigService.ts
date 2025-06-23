import { AiConfig, AiConfigData } from './aiConfig.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class AiConfigsService {
    private repository: BaseRepository<AiConfig>;
    private block = "aiConfig.service"
    constructor(repository: BaseRepository<AiConfig>) {
        this.repository = repository
    }

    async create(aiConfig: Omit<AiConfigData, "aiConfigId">): Promise<AiConfig> {
        const mappedAiConfig = this.mapToDb(aiConfig);
        try {
            return this.repository.create(mappedAiConfig as AiConfig);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedAiConfig)
            throw error;
        }
    }

    async resource(agentId: string): Promise<AiConfigData | null> {
        try {
            const result = await this.repository.selectOne("agent_id", agentId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {agentId})
            throw error;
        }
    }

    async update(aiConfigId: string, changes: AiConfigData): Promise<AiConfig> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("ai_config_id", aiConfigId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(aiConfigId: string): Promise<AiConfig> {
        try {
            return await this.repository.delete("ai_config_id", aiConfigId) as AiConfig;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {aiConfigId})
            throw error;
        }
    }

    mapToDb(aiConfig: Omit<AiConfigData, "aiConfigId">): Omit<AiConfig, "ai_config_id"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           agent_id: aiConfig.agentId,
           system_prompt: aiConfig.systemPrompt,
           max_tokens: aiConfig.maxTokens,
           temperature: aiConfig.temperature
        }
    }

    mapFromDb(aiConfig: AiConfig): AiConfigData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            aiConfigId: aiConfig.agent_id,
            agentId: aiConfig.agent_id,
            systemPrompt: aiConfig.system_prompt,
            maxTokens: aiConfig.max_tokens,
            temperature: aiConfig.temperature
        }
    }
}
