import SessionsService from "./SessionsService";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import { RedisClientType } from "redis";

export function configureSessionsDependencies(client: RedisClientType): void {
    const service = new SessionsService(client);
    
    Container.register<SessionsService>("SessionsService", service);
    return;
}
