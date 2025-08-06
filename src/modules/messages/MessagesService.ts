import { Message, MessageData } from './messages.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class MessagesService {
    private repository: BaseRepository<Message>;
    private block = "messages.service"
    constructor(repository: BaseRepository<Message>) {
        this.repository = repository
    }

    async create(messages: MessageData): Promise<Message> {
        const mappedMessage = this.mapToDb(messages);
        try {
            return this.repository.create(mappedMessage);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedMessage)
            throw error;
        }
    }

    async resource(messageId: string): Promise<MessageData | null> {
        try {
            const result = await this.repository.selectOne("message_id", messageId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {messageId})
            throw error;
        }
    }

    async collection(conversationId: string): Promise<MessageData[]> {
        try {
            const result = await this.repository.select("conversation_id", conversationId);
        
            return result.map((message) => this.mapFromDb(message))
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {conversationId})
            throw error;
        }
    }

    // async update(changes: MessageData): Promise<Message> {
    //     const mappedChanges = this.mapToDb(changes);
    //     const cleanedChanges = Object.fromEntries(
    //         Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
    //     );
    //     try {
    //         return await this.repository.update();
    //     } catch (error) {
    //         handleServiceError(error as Error, this.block, "update", cleanedChanges)
    //         throw error;
    //     }
    // }

    // async delete(): Promise<Message> {
    //     try {
    //         return await this.repository.delete() as Message;
    //     } catch (error) {
    //         handleServiceError(error as Error, this.block, "delete")
    //         throw error;
    //     }
    // }

    mapToDb(message: MessageData): Message {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            message_reference_id: message.messageReferenceId,
          conversation_id: message.conversationId,
          sender: message.sender,
          text: message.text,
          sub_text: message.subText,
          media: message.media,
          media_type: message.mediaType,
          buttons: message.buttons,
          type: message.type 
        }
    }

    mapFromDb(message: Message): MessageData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            messageId: message.message_id,
            messageReferenceId: message.message_reference_id,
            conversationId: message.conversation_id,
            sender: message.sender,
            text: message.text,
            subText: message.sub_text,
            media: message.media,
            mediaType: message.media_type,
            buttons: message.buttons,
            type: message.type,
            timestamp: message.timestamp
        }
    }
}
