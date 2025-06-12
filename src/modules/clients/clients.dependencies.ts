import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Client } from "./clients.interface";
import ClientsService from "./ClientsService";
import ClientsController from "./ClientsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureClientsDependencies(pool: Pool): void {
    const repository = new BaseRepository<Client>(pool, "clients");
    const service = new ClientsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new ClientsController(httpService, service);

    Container.register<ClientsService>("ClientsService", service);
    Container.register<ClientsController>("ClientsController", controller);
    return;
}
