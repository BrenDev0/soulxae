import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import WebhooksService from "../webhooks/WebhooksService";
import MessengerController from "./MessengerController";
import MessengerService from "./MessengerService";

export function configureMessengerDependencies(): void {
    const service = new MessengerService();
    const httpService = Container.resolve<HttpService>("HttpService");
    const webhookService = Container.resolve<WebhooksService>("WebhookService");
    const controller = new MessengerController(httpService, webhookService);

    Container.register<MessengerService>("MessengerService", service);
    Container.register<MessengerController>("MessengerController", controller);
    return;
}
