import WhatsappService from "./WhatsappService";
import WhatsappController from "./WhatsappController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import WebhooksService from "../webhooks/WebhooksService";

export function configureWhatsappDependencies(): void {
    const service = new WhatsappService();
    const httpService = Container.resolve<HttpService>("HttpService");
    const webhookService = Container.resolve<WebhooksService>("WebhookService");
    const controller = new WhatsappController(httpService, webhookService);

    Container.register<WhatsappService>("WhatsappService", service);
    Container.register<WhatsappController>("WhatsappController", controller);
    return;
}
