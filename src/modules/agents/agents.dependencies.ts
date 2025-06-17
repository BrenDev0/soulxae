import { Pool } from "pg";
import AgentsService from "./AgentsService";
import AgentsController from "./AgentsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import BaseRepository from "../../core/repository/BaseRepository";
import { Agent } from "./agents.interface";

export function configureAgentsDependencies(pool: Pool): void {
    const repository = new BaseRepository<Agent>(pool, "agents");
    const service = new AgentsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new AgentsController(httpService, service);

    Container.register<AgentsService>("AgentsService", service);
    Container.register<AgentsController>("AgentsController", controller);
    return;
}
