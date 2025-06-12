import { Platform, PlatformData } from './platforms.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';
import PlatformsRepository from './PlatformsRepository';

export default class PlatformsService {
    private repository: PlatformsRepository;
    private block = "platforms.service"
    constructor(repository: PlatformsRepository) {
        this.repository = repository
    }

    async create(platform: PlatformData): Promise<Platform> {
        const mappedPlatform = this.mapToDb(platform);
        try {
            return this.repository.create(mappedPlatform);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedPlatform)
            throw error;
        }
    }


    async resource(whereCol: string, identifier: string): Promise<Omit<PlatformData, "token"> | null> {
        try {
            const result = await this.repository.selectOne(whereCol, identifier);
            if(!result) {
                return null
            }
            return this.mapFromDb(result);
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {whereCol, identifier})
            throw error;
        }
    }

    async getAgentPlatform(agentId: string, platform: string) {
        try {
            const result = await this.repository.getAgentPlatform(agentId, platform);
            if(!result) {
                return null
            }
            return this.mapFromDb(result);
        } catch (error) {
            handleServiceError(error as Error, this.block, "getAgentPlatform", {agentId, platform})
            throw error;
        }
    }

    async collection(agentId: string): Promise<Omit<PlatformData, "token">[]> {
        try {
            const result = await this.repository.select("agent_id", agentId);

            const data = result.map((platform) => this.mapFromDb(platform));

            return data;
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {agentId})
            throw error;
        }
    }

    async update(platformId: string, changes: PlatformData): Promise<Platform> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("platform_id", platformId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(platformId: string): Promise<Platform> {
        try {
            return await this.repository.delete("platform_id", platformId) as Platform;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {platformId})
            throw error;
        }
    }

    mapToDb(platform: PlatformData): Platform {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           agent_id: platform.agentId,
           platform: platform.platform,
           webhook_url: platform.webhookUrl,
           webhook_secret: platform.webhookSecret && encryptionService.encryptData(platform.webhookSecret),
           token: platform.token && encryptionService.encryptData(platform.token),
           identifier: platform.identifier && encryptionService.encryptData(platform.identifier)
        }
    }

    mapFromDb(platform: Platform): Omit<PlatformData, "token"> {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            platformId: platform.platform_id,
            agentId: platform.agent_id,
            platform: platform.platform,
            webhookUrl: platform.webhook_url,
            webhookSecret: encryptionService.decryptData(platform.webhook_secret),
            identifier: encryptionService.decryptData(platform.identifier)
        }
    }
}
