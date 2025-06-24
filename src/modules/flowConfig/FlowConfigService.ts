import { FlowConfig, FlowConfigData } from './flowConfig.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class FlowConfigsService {
    private repository: BaseRepository<FlowConfig>;
    private block = "flowConfig.service"
    constructor(repository: BaseRepository<FlowConfig>) {
        this.repository = repository
    }

    async create(flowConfig: Omit<FlowConfigData, "flowConfigId">): Promise<FlowConfig> {
        const mappedFlowConfig = this.mapToDb(flowConfig);
        try {
            return this.repository.create(mappedFlowConfig as FlowConfig);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedFlowConfig)
            throw error;
        }
    }

    async resource(agentId: string): Promise<FlowConfigData | null> {
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

    async update(flowConfigId: string, changes: FlowConfigData): Promise<FlowConfig> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("flowConfig_id", flowConfigId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(flowConfigId: string): Promise<FlowConfig> {
        try {
            return await this.repository.delete("flowConfig_id", flowConfigId) as FlowConfig;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {flowConfigId})
            throw error;
        }
    }

    mapToDb(flowConfig: Omit<FlowConfigData, "flowConfigId">): Omit<FlowConfig, "flow_config_id"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           agent_id: flowConfig.agentId,
           provider: flowConfig.provider,
           api_key: flowConfig.apiKey && encryptionService.encryptData(flowConfig.apiKey)
        }
    }

    mapFromDb(flowConfig: FlowConfig): FlowConfigData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            flowConfigId: flowConfig.flow_config_id,
            agentId: flowConfig.agent_id,
            provider: flowConfig.provider,
            apiKey: encryptionService.decryptData(flowConfig.api_key)
        }
    }
}
