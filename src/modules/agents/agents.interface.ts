import { IRepository } from "../../core/repository/repository.interface";

export interface Agent {
  agent_id?: string;
  agent_type: string;
  workspace_id: string;
  provider: string;
  api_key: string;
  name: string;
  description: string
  user_id?: string;
  provider_identifier?: string;
  phone?: string;
}

export interface AgentData {
  agentId?: string;
  agentType: string;
  workspaceId: string;
  provider: string;
  apiKey: string;
  name: string;
  description: string;
  userId?: string;
  providerIdentifier?: string;
  phone?: string;
}

export interface IAgentsRepository extends IRepository<Agent> {
  resource(agentId: string): Promise<Agent | null>
  collection(workspaceId: string): Promise<Agent[]>
}
