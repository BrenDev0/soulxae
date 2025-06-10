export interface Agent {
  agent_id?: string;
  workspace_id: string;
  provider: string;
  api_key: string;
  name: string;
  description: string

}

export interface AgentData {
  agentId?: string;
  workspaceId: string;
  provider: string;
  apiKey: string;
  name: string;
  description: string

}
