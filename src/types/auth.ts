export type DbStrategyType = 'shared' | 'isolated';

export interface CreateTenantRequest {
  name: string;
  db_strategy_type: DbStrategyType;
}

export interface TenantResponse {
  id: string;
  name: string;
  db_strategy_type: DbStrategyType;
  anon_key: string;
}

export interface AuthTokenResponse {
  token: string;
  refresh_token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface VerifyResponse {
  is_valid: boolean;
}
