export interface AiTool {
  tool_id: string;
  agent_id: string;
  name: string
}

export interface AiToolData {
  toolId: string;
  agentId: string;
  name: string
}


export interface IAiToolsRepository {
  create(agentId: string, toolId: string): Promise<AiTool>;
  read(): Promise<Omit<AiTool, "agent_id">[]>;
  resource(agentId: string, toolId: string): Promise<AiTool | null>;
  collection(agentId: string): Promise<AiTool[]>;
  delete(agentId: string, toolId: string): Promise<AiTool>;

}
