import { IRepository } from "../../core/repository/repository.interface";

export interface Agent {
  agent_id?: string;
  name: string;
  description: string;
  type: string;
  user_id: string;
}

export interface AgentData {
  agentId?: string;
  name: string;
  description: string;
  type: string;
  userId: string;
}

export interface IAgentsRepository extends IRepository<Agent> {
  resource(agentId: string): Promise<Agent | null>
  collection(workspaceId: string): Promise<Agent[]>
}
