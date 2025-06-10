// import { Pool } from "pg";
// import BaseRepository from "../../core/repository/BaseRepository";
// import { Whatsapp } from "./whatsapp.interface";
// import WhatsappService from "./WhatsappService";
// import WhatsappController from "./WhatsappController";
// import Container from "../../core/dependencies/Container";
// import HttpService from "../../core/services/HttpService";

// export function configureWhatsappDependencies(pool: Pool): void {
//     const repository = new BaseRepository<Whatsapp>(pool, "whatsapp");
//     const service = new WhatsappService(repository);
//     const httpService = Container.resolve<HttpService>("HttpService");
//     const controller = new WhatsappController(httpService, service);

//     Container.register<WhatsappService>("WhatsappService", service);
//     Container.register<WhatsappController>("WhatsappController", controller);
//     return;
// }
