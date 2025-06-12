import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import PlatformsService from "../platforms/PlatformsService";
import WebhooksService from "./WebhooksService";

export function configureWebhooksDependencies(): void {
    const httpService = Container.resolve<HttpService>("HttpService");
    const platformsService = Container.resolve<PlatformsService>("PlatformsService");
    const service = new WebhooksService(httpService, platformsService);

   
    Container.register<WebhooksService>("WebhookService", service);
    return;
}
