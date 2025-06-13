import { Client, ClientData } from './clients.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';
import { agent } from 'supertest';

export default class ClientsService {
    private repository: BaseRepository<Client>;
    private block = "clients.service"
    constructor(repository: BaseRepository<Client>) {
        this.repository = repository
    }

    async create(clients: ClientData): Promise<Client> {
        const mappedClient = this.mapToDb(clients);
        try {
            return this.repository.create(mappedClient);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedClient)
            throw error;
        }
    }

    async resource(whereCol: string, identifier: string): Promise<ClientData | null> {
        try {
            const result = await this.repository.selectOne(whereCol, identifier);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {whereCol, identifier})
            throw error;
        }
    }

    async collection(agentId: string): Promise<ClientData[]> {
        try {
            const result = await this.repository.select("agent_id", agentId);
            
            return result.map((client) => this.mapFromDb(client))
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {agentId})
            throw error;
        }
    }

    async update(clientId: string, changes: ClientData): Promise<Client> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("clientId", clientId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(clientId: string): Promise<Client> {
        try {
            return await this.repository.delete("client_id", clientId) as Client;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {clientId})
            throw error;
        }
    }

    mapToDb(client: ClientData): Client {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agent_id: client.agentId,
            name: client.name === null ? null : encryptionService.encryptData(client.name),
            contact_identifier: client.contactIdentifier && encryptionService.encryptData(client.contactIdentifier)
        }
    }

    mapFromDb(client: Client): ClientData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            clientId: client.client_id,
            agentId: client.agent_id,
            name: client.name === null ? null : encryptionService.decryptData(client.name),
            contactIdentifier: encryptionService.decryptData(client.contact_identifier)
        }
    }
}
