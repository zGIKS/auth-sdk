import { HttpClient } from '../core/network/http-client';
import { CreateTenantRequest, TenantResponse } from '../types/auth';

export class TenantsResource {
  constructor(private readonly client: HttpClient) {}

  async create(payload: CreateTenantRequest): Promise<TenantResponse> {
    return this.client.request<TenantResponse>('/api/v1/tenants', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async get(tenantId: string): Promise<TenantResponse> {
    return this.client.request<TenantResponse>(`/api/v1/tenants/${tenantId}`, {
      method: 'GET',
    });
  }
}
