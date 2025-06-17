import { Subscription, SubscriptionData } from './subscriptions.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class SubscriptionsService {
    private repository: BaseRepository<Subscription>;
    private block = "subscriptions.service"
    constructor(repository: BaseRepository<Subscription>) {
        this.repository = repository
    }

    async create(subscriptions: SubscriptionData): Promise<Subscription> {
        const mappedSubscription = this.mapToDb(subscriptions);
        try {
            return this.repository.create(mappedSubscription);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedSubscription)
            throw error;
        }
    }

    async resource(subscriptionId: string): Promise<SubscriptionData | null> {
        try {
            const result = await this.repository.selectOne("subscription_id", subscriptionId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {subscriptionId})
            throw error;
        }
    }

    async update(subscriptionId: string, changes: SubscriptionData): Promise<Subscription> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("subscription_id", subscriptionId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(subscriptionId: string): Promise<Subscription> {
        try {
            return await this.repository.delete("Subscription_id", subscriptionId) as Subscription;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {subscriptionId})
            throw error;
        }
    }

    mapToDb(subscription: SubscriptionData): Subscription {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            name: subscription.name,
            details: subscription.details,
            price_month: subscription.priceMonth,
            price_year: subscription.priceYear,
            agency_limit: subscription.agencyLimit,
            agent_limit: subscription.agentLimit
        }
    }

    mapFromDb(subscription: Subscription): SubscriptionData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            subscriptionId: subscription.subscription_id,
            name: subscription.name,
            details: subscription.details,
            priceMonth: subscription.price_month,
            priceYear: subscription.price_year,
            agencyLimit: subscription.agency_limit,
            agentLimit: subscription.agent_limit
        }
    }
}
