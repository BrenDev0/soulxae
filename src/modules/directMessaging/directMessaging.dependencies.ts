import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import DirectMessagagingController from "./DirectMessagingController";
import { DirectMessagagingService } from "./DirectMessagingService";

export function configureDirectMessagingDependencies(): void {
    const httpService = Container.resolve<HttpService>("HttpService");
    const service = new DirectMessagagingService();
    const controller = new DirectMessagagingController(httpService, service);

   Container.register<DirectMessagagingService>("DirectMessagingService", service)
    Container.register<DirectMessagagingController>("DirectMessagingController", controller);
    return;
}
