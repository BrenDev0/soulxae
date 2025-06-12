import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import WebhooksService from "../webhooks/WebhooksService";
import DirectMessagagingController from "./DirectMessagingController";

export function configureDirectMessagingDependencies(): void {
    const httpService = Container.resolve<HttpService>("HttpService");
    const webhookService = Container.resolve<WebhooksService>("WebhookService");
    const controller = new DirectMessagagingController(httpService, webhookService);

   
    Container.register<DirectMessagagingController>("DirectMessagingController", controller);
    return;
}
