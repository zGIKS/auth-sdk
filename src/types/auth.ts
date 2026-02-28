export interface AuthTokenResponse {
  token: string;
  refresh_token: string;
}

export interface RegisterIdentityResponse {
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  tenant_anon_key?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
  tenant_anon_key?: string;
}

export interface VerifyResponse {
  is_valid: boolean;
}
