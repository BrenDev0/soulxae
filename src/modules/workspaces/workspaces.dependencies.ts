import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Workspace } from "./workspaces.interface";
import WorkspacesService from "./WorkspacesService";
import WorkspacesController from "./WorkspacesController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureWorkspacesDependencies(pool: Pool): void {
    const repository = new BaseRepository<Workspace>(pool, "workspaces");
    const service = new WorkspacesService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new WorkspacesController(httpService, service);

    Container.register<WorkspacesService>("WorkspacesService", service);
    Container.register<WorkspacesController>("WorkspacesController", controller);
    return;
}
