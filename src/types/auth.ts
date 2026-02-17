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
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface VerifyResponse {
  is_valid: boolean;
}
