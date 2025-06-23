import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { AiConfig } from "./aiConfig.interface";
import AiConfigService from "./AiConfigService";
import AiConfigController from "./AiConfigController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import AgentsService from "../agents/AgentsService";

export function configureAiConfigDependencies(pool: Pool): void {
    const repository = new BaseRepository<AiConfig>(pool, "aiConfig");
    const service = new AiConfigService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const agentsService = Container.resolve<AgentsService>("AgentsService");
    const controller = new AiConfigController(httpService, service, agentsService);

    Container.register<AiConfigService>("AiConfigService", service);
    Container.register<AiConfigController>("AiConfigController", controller);
    return;
}
