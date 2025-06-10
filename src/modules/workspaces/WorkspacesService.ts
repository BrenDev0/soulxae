import { Workspace, WorkspaceData } from './workspaces.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class WorkspaceService {
    private repository: BaseRepository<Workspace>;
    private block = "workspaces.service"
    constructor(repository: BaseRepository<Workspace>) {
        this.repository = repository
    }

    async create(workspaces: WorkspaceData): Promise<Workspace> {
        const mappedWorkspace = this.mapToDb(workspaces);
        try {
            return this.repository.create(mappedWorkspace);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedWorkspace)
            throw error;
        }
    }

    async resource(workspaceId: string): Promise<WorkspaceData | null> {
        try {
            const result = await this.repository.selectOne("workspace_id", workspaceId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {workspaceId})
            throw error;
        }
    }

     async collection(userId: string): Promise<WorkspaceData[]> {
        try {
            const result = await this.repository.select("user_id", userId);
          
            const data = result.map((workspace) => this.mapFromDb(workspace));
            return data;
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {userId})
            throw error;
        }
    }

    async update(workspaceId: string, changes: WorkspaceData): Promise<Workspace> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("workspace_id", workspaceId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(workspaceId: string): Promise<Workspace> {
        try {
            return await this.repository.delete("workspace_id", workspaceId) as Workspace;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {workspaceId})
            throw error;
        }
    }

    mapToDb(workspace: WorkspaceData): Workspace {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           user_id: workspace.userId,
           name: workspace.name
        }
    }

    mapFromDb(workspace: Workspace): WorkspaceData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            workspaceId: workspace.workspace_id,
            userId: workspace.user_id,
            name: workspace.name
        }
    }
}
