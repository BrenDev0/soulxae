import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Conversation } from "./conversations.interface";
import ConversationsService from "./ConversationsService";
import ConversationsController from "./ConversationsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureConversationsDependencies(pool: Pool): void {
    const repository = new BaseRepository<Conversation>(pool, "conversations");
    const service = new ConversationsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new ConversationsController(httpService, service);

    Container.register<ConversationsService>("ConversationsService", service);
    Container.register<ConversationsController>("ConversationsController", controller);
    return;
}
