import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Platform } from "./platforms.interface";
import PlatformsService from "./PlatformsService";
import PlatformsController from "./PlatformsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configurePlatformsDependencies(pool: Pool): void {
    const repository = new BaseRepository<Platform>(pool, "platforms");
    const service = new PlatformsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new PlatformsController(httpService, service);

    Container.register<PlatformsService>("PlatformsService", service);
    Container.register<PlatformsController>("PlatformsController", controller);
    return;
}
