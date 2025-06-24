import { Pool } from "pg";
import AiToolsService from "./AiToolsService";
import AiToolsController from "./AiToolsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import AiToolsRepository from "./AiToolsRepository";
import AgentsService from "../agents/AgentsService";

export function configureAiToolsDependencies(pool: Pool): void {
    const repository = new AiToolsRepository(pool);
    const service = new AiToolsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const agentsService = Container.resolve<AgentsService>("AgentsService");
    const controller = new AiToolsController(httpService, service, agentsService);

    Container.register<AiToolsService>("AiToolsService", service);
    Container.register<AiToolsController>("AiToolsController", controller);
    return;
}
