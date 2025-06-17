import { IRepository } from "../../core/repository/repository.interface";

export interface Agent {
  agent_id?: string;
  name: string;
  description: string;
  system_promt: string;
  greeting_message: string | null;
  max_tokens: number;
  temperature: number;
  user_id: string;
}

export interface AgentData {
  agentId?: string;
  name: string;
  description: string;
  systemPromt: string;
  greetingMessage: string | null;
  maxTokens: number;
  temperature: number;
  userId: string;
}

export interface IAgentsRepository extends IRepository<Agent> {
  resource(agentId: string): Promise<Agent | null>
  collection(workspaceId: string): Promise<Agent[]>
}
