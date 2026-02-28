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
    const tenantAnonKey = this.resolveTenantAnonKey(payload.tenant_anon_key);
    return this.post<AuthTokenResponse>('/api/v1/auth/sign-in', {
      ...payload,
      tenant_anon_key: tenantAnonKey,
    });
  }

  async signUp(payload: SignUpRequest): Promise<RegisterIdentityResponse> {
    // La respuesta solo incluye un mensaje porque el backend no emite tokens aún
    const tenantAnonKey = this.resolveTenantAnonKey(payload.tenant_anon_key);
    return this.post<RegisterIdentityResponse>('/api/v1/identity/sign-up', {
      ...payload,
      tenant_anon_key: tenantAnonKey,
    });
  }

  async refreshToken(refreshToken: string, tenantAnonKeyOverride?: string): Promise<AuthTokenResponse> {
    const tenantAnonKey = this.resolveTenantAnonKey(tenantAnonKeyOverride);
    return this.post<AuthTokenResponse>('/api/v1/auth/refresh-token', {
      refresh_token: refreshToken,
      tenant_anon_key: tenantAnonKey,
    });
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

  getConfirmRegistrationUrl(token: string, tenantAnonKeyOverride?: string): string {
    const params = new URLSearchParams({ token });
    const tenantAnonKey = this.resolveTenantAnonKey(tenantAnonKeyOverride);
    if (tenantAnonKey) {
      params.set('tenant_anon_key', tenantAnonKey);
    }
    return `${this.client.getBaseUrl()}/api/v1/identity/confirm-registration?${params.toString()}`;
  }

  getGoogleAuthUrl(tenantAnonKeyOverride?: string): string {
    const url = new URL('/api/v1/auth/google', this.client.getBaseUrl());
    const tenantAnonKey = this.resolveTenantAnonKey(tenantAnonKeyOverride);
    if (tenantAnonKey) {
      url.searchParams.set('tenant_anon_key', tenantAnonKey);
    }
    return url.toString();
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

  private resolveTenantAnonKey(override?: string): string | undefined {
    return override ?? this.client.getTenantAnonKey();
  }
}
