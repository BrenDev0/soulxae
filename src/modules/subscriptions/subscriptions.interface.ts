export interface Subscription {
  subscription_id?: string;
  name: string;
  details: string;
  price_month: number;
  price_year: number;
  agency_limit: number;
  agent_limit: number;
  create_at?: Date
}

export interface SubscriptionData {
  subscriptionId?: string;
  name: string;
  details: string;
  priceMonth: number;
  priceYear: number;
  agencyLimit: number;
  agentLimit: number;
  createAt?: Date
}
