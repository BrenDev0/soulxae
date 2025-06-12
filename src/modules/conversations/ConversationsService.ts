import { Conversation, ConversationForAPI, ConversationData, ConversationForAPIData } from './conversations.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';
import ConversationsRepositoy from './ConversationsRepository';

export default class ConversationsService {
    private repository: ConversationsRepositoy
    private block = "conversations.service"
    constructor(repository: ConversationsRepositoy) {
        this.repository = repository
    }

    async create(conversation: ConversationData): Promise<Conversation> {
        const mappedConversation = this.mapToDb(conversation);
        try {
            return this.repository.create(mappedConversation);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedConversation)
            throw error;
        }
    }

    async resource(conversationId: string): Promise<ConversationData | null> {
        try {
            const result = await this.repository.selectOne("conversation_id", conversationId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", { conversationId })
            throw error;
        }
    }

    async findByParticipantIds(agentId: string, clientId: string): Promise<ConversationData | null> {
        try {
            const result = await this.repository.findByIds(agentId, clientId)
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "findByIds", { agentId, clientId })
            throw error;
        }
    }

    async getAPIData(conversationId: string): Promise<ConversationForAPIData | null> {
         try {
            const result = await this.repository.getAPIData(conversationId);
            if(!result) {
                return null
            }
            return this.mapForAPI(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", { conversationId })
            throw error;
        }
    }

    async update(conversationId: string, changes: ConversationData): Promise<Conversation> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("conversation_id", conversationId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(conversationId: string): Promise<Conversation> {
        try {
            return await this.repository.delete("conversation_id", conversationId) as Conversation;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", { conversationId })
            throw error;
        }
    }

    mapToDb(conversation: ConversationData): Conversation {
        console.log("CONVERSATION::::::", conversation)
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
           agent_id: conversation.agentId,
           platform: conversation.platform,
           client_id: conversation.clientId,
           title: conversation.title,
           handoff: conversation.handoff
        }
    }

    mapFromDb(conversation: Conversation): ConversationData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            conversationId: conversation.conversation_id,
            agentId: conversation.agent_id,
            platform: conversation.platform,
            clientId: conversation.client_id,
            title: conversation.title,
            handoff: conversation.handoff,
            platformIdentifier: conversation.platform_identifier && encryptionService.decryptData(conversation.platform_identifier),
            clientIdentifier: conversation.client_identifier && encryptionService.decryptData(conversation.client_identifier) 
        }
    }

    mapForAPI(conversation: ConversationForAPI): ConversationForAPIData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            conversationId: conversation.conversation_id!,
            agentId: conversation.agent_id,
            platform: conversation.platform,
            clientId: conversation.client_id,
            title: conversation.title,
            handoff: conversation.handoff,
            platformIdentifier: encryptionService.decryptData(conversation.platform_identifier),
            clientIdentifier: encryptionService.decryptData(conversation.client_identifier),
            token: encryptionService.decryptData(conversation.token)
        }
    }
}
