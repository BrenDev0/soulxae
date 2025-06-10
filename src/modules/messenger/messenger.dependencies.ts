// import { Pool } from "pg";
// import BaseRepository from "../../core/repository/BaseRepository";
// import { Messenger } from "./messenger.interface";
// import MessengerService from "./MessengerService";
// import MessengerController from "./MessengerController";
// import Container from "../../core/dependencies/Container";
// import HttpService from "../../core/services/HttpService";

// export function configureMessengerDependencies(pool: Pool): void {
//     const repository = new BaseRepository<Messenger>(pool, "messenger");
//     const service = new MessengerService(repository);
//     const httpService = Container.resolve<HttpService>("HttpService");
//     const controller = new MessengerController(httpService, service);

//     Container.register<MessengerService>("MessengerService", service);
//     Container.register<MessengerController>("MessengerController", controller);
//     return;
// }
