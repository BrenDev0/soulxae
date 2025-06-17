export interface User {
  user_id?: string;
  email: string;
  name: string;
  password: string,
  subscription_id: string | null;
  is_admin: boolean;
  created_at?: string
}

export interface UserData {
  userId?: string;
  email: string;
  name: string;
  password: string,
  subscriptionId: string | null;
  isAdmin: boolean;
  createdAt?: string
}
