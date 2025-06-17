export interface Employee {
  employee_id?: string;
  agent_id: string;
  user_id: string;
  name?: string;
  password?: string;
  email?: string;
  created_at?: Date
}

export interface EmployeeData {
  employeeId?: string;
  agentId: string;
  userId: string;
  name?: string;
  password?: string;
  email?: string;
  createdAt?: Date
}
