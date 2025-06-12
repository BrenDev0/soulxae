import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import DirectMessagagingController from "./DirectMessagingController";

export function configureDirectMessagingDependencies(): void {
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new DirectMessagagingController(httpService);

   
    Container.register<DirectMessagagingController>("DirectMessagingController", controller);
    return;
}
