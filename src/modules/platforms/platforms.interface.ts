export interface Platform {
  platform_id?: string;
  agent_id: string;
  platform: string;
  webhook_url: string;
  webhook_secret: string;
  token: string;
}

export interface PlatformData {
  platformId?: string;
  agentId: string;
  platform: string;
  webhookUrl: string;
  webhookSecret: string;
  token: string;
}
