import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Message } from "./messages.interface";
import MessagesService from "./MessagesService";
import MessagesController from "./MessagesController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureMessagesDependencies(pool: Pool): void {
    const repository = new BaseRepository<Message>(pool, "messages");
    const service = new MessagesService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new MessagesController(httpService, service);

    Container.register<MessagesService>("MessagesService", service);
    Container.register<MessagesController>("MessagesController", controller);
    return;
}
