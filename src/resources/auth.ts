import { HttpClient } from '../core/network/http-client';
import {
  AuthTokenResponse,
  RegisterIdentityResponse,
  SignInRequest,
  SignUpRequest,
  VerifyResponse,
} from '../types/auth';

export class AuthResource {
  constructor(private readonly client: HttpClient) {}

  async signIn(payload: SignInRequest): Promise<AuthTokenResponse> {
    return this.post<AuthTokenResponse>('/api/v1/auth/sign-in', payload);
  }

  async signUp(payload: SignUpRequest): Promise<RegisterIdentityResponse> {
    // La respuesta solo incluye un mensaje porque el backend no emite tokens aún
    return this.post<RegisterIdentityResponse>('/api/v1/identity/sign-up', payload);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return this.post<AuthTokenResponse>('/api/v1/auth/refresh-token', { refresh_token: refreshToken });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.post('/api/v1/auth/logout', { refresh_token: refreshToken });
  }

  async verifyToken(token: string): Promise<VerifyResponse> {
    return this.client.request<VerifyResponse>('/api/v1/auth/verify', {
      method: 'GET',
      params: { token },
    });
  }

  getConfirmRegistrationUrl(token: string): string {
    const params = new URLSearchParams({ token });
    return `${this.client.getBaseUrl()}/api/v1/identity/confirm-registration?${params.toString()}`;
  }

  getGoogleAuthUrl(): string {
    return new URL('/api/v1/auth/google', this.client.getBaseUrl()).toString();
  }

  async claimGoogle(code: string, state?: string): Promise<AuthTokenResponse> {
    const payload = state ? { code, state } : { code };
    return this.post<AuthTokenResponse>('/api/v1/auth/google/claim', payload);
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post('/api/v1/identity/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.post('/api/v1/identity/reset-password', { token, new_password: newPassword });
  }

  private async post<T = void>(path: string, body: unknown): Promise<T> {
    return this.client.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}
