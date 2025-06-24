import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { FlowConfig } from "./flowConfig.interface";
import FlowConfigService from "./FlowConfigService";
import FlowConfigController from "./FlowConfigController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import AgentsService from "../agents/AgentsService";

export function configureFlowConfigDependencies(pool: Pool): void {
    const repository = new BaseRepository<FlowConfig>(pool, "flow_config");
    const service = new FlowConfigService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const agentsService = Container.resolve<AgentsService>("AgentsService");
    const controller = new FlowConfigController(httpService, service, agentsService);

    Container.register<FlowConfigService>("FlowConfigService", service);
    Container.register<FlowConfigController>("FlowConfigController", controller);
    return;
}
