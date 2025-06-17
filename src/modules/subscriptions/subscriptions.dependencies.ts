import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Subscription } from "./subscriptions.interface";
import SubscriptionsService from "./SubscriptionsService";
import SubscriptionsController from "./SubscriptionsController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureSubscriptionsDependencies(pool: Pool): void {
    const repository = new BaseRepository<Subscription>(pool, "subscriptions");
    const service = new SubscriptionsService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new SubscriptionsController(httpService, service);

    Container.register<SubscriptionsService>("SubscriptionsService", service);
    Container.register<SubscriptionsController>("SubscriptionsController", controller);
    return;
}
