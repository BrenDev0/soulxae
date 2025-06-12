import WhatsappService from "./WhatsappService";
import WhatsappController from "./WhatsappController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureWhatsappDependencies(): void {
    const service = new WhatsappService();
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new WhatsappController(httpService);

    Container.register<WhatsappService>("WhatsappService", service);
    Container.register<WhatsappController>("WhatsappController", controller);
    return;
}
