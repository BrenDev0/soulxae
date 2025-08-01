

export interface GoogleUser {
  refresh_token: string;
}

export interface Token {
  refresh_token: string;
  user_id: string;
}

export interface GoogleSession {
  userId: string
}


export interface IGoogleRepository {
  getGoogleUser(userId: string): Promise<GoogleUser>
  upsertToken(token: Token): Promise<void>
}
