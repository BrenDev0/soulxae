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

export interface PlatformPrivate {
  user_id: string;
  token: string;
  identifier: string;
  agent_type: string;
  platform_id: string;
  webhook_secret: string
}

export interface IPlatformsRepository extends IRepository<Platform> {
  getPlatformByAgentId(agentId: string, platform: string): Promise<PlatformPrivate | null>
}
