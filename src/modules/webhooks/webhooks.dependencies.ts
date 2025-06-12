import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import WebhooksService from "./WebhooksService";

export function configureWebhooksDependencies(): void {
    const httpService = Container.resolve<HttpService>("HttpService");
    const service = new WebhooksService(httpService);

   
    Container.register<WebhooksService>("WebhookService", service);
    return;
}
