import { IRepository } from "../../core/repository/repository.interface";
import { Agent } from "../agents/agents.interface";

export interface Platform {
  platform_id?: string;
  agent_id: string;
  platform: string;
  webhook_url: string;
  webhook_secret: string;
  token: string;
  identifier: string;
}

export interface PlatformData {
  platformId?: string;
  agentId: string;
  platform: string;
  webhookUrl: string;
  webhookSecret: string;
  token: string;
  identifier: string;
}

export interface AgentPlatform {
    platform_id: string,
    agent_id: string,
    platform: string,
    webhook_url: string,
    webhook_secret: string,
    token: string,
    identifier: string;
    workspace_id: string,
    name: string,
    description: string,
    agent_type: string,
    provider: string,
    api_key: string
}

export interface IPlatformsRepository extends IRepository<Platform> {
  getAgentPlatform(agentId: string, platform: string): Promise<AgentPlatform | null>
}
