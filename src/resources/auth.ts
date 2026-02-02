import { HttpClient } from '../core/network/http-client';
import { SDKError } from '../core/errors';
import {
  AuthTokenResponse,
  SignInRequest,
  SignUpRequest,
  VerifyResponse,
} from '../types/auth';

export class AuthResource {
  constructor(private readonly client: HttpClient) {}

  async signIn(payload: SignInRequest): Promise<AuthTokenResponse> {
    const tokens = await this.post<AuthTokenResponse>('/api/v1/auth/sign-in', payload);
    await this.ensureTokenValid(tokens.token);
    return tokens;
  }

  async signUp(payload: SignUpRequest): Promise<AuthTokenResponse> {
    const tokens = await this.post<AuthTokenResponse>('/api/v1/auth/sign-up', payload);
    await this.ensureTokenValid(tokens.token);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return this.post<AuthTokenResponse>('/api/v1/auth/refresh', { refresh_token: refreshToken });
  }

  async logout(token: string): Promise<void> {
    await this.post('/api/v1/auth/logout', { token });
  }

  async verifyToken(token: string): Promise<VerifyResponse> {
    return this.client.request<VerifyResponse>('/api/v1/auth/verify', {
      method: 'GET',
      params: { token },
    });
  }

  async confirmRegistration(token: string): Promise<VerifyResponse> {
    return this.client.request<VerifyResponse>('/api/v1/auth/confirm-registration', {
      method: 'GET',
      params: { token },
    });
  }

  async googleCallback(code: string, state?: string): Promise<AuthTokenResponse> {
    return this.client.request<AuthTokenResponse>('/api/v1/auth/google/callback', {
      method: 'GET',
      params: state ? { code, state } : { code },
    });
  }

  private async post<T = void>(path: string, body: unknown): Promise<T> {
    return this.client.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async ensureTokenValid(token: string): Promise<void> {
    const validation = await this.verifyToken(token);
    if (!validation.is_valid) {
      throw new SDKError('Token validation failed', 'TOKEN_VALIDATION_FAILED');
    }
  }
}
