import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Agency } from "./agencies.interface";
import AgenciesService from "./AgenciesService";
import AgenciesController from "./AgenciesController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureAgenciesDependencies(pool: Pool): void {
    const repository = new BaseRepository<Agency>(pool, "agencies");
    const service = new AgenciesService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new AgenciesController(httpService, service);

    Container.register<AgenciesService>("AgenciesService", service);
    Container.register<AgenciesController>("AgenciesController", controller);
    return;
}
