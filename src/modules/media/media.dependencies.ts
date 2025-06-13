import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Media } from "./media.interface";
import MediaService from "./MediaService";
import MediaController from "./MediaController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureMediaDependencies(pool: Pool): void {
    // const repository = new BaseRepository<Media>(pool, "media");
    // const service = new MediaService(repository);
    // const httpService = Container.resolve<HttpService>("HttpService");
    // const controller = new MediaController(httpService, service);

    // Container.register<MediaService>("MediaService", service);
    // Container.register<MediaController>("MediaController", controller);
    // return;
}
