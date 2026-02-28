export interface RequestConfig extends Omit<RequestInit, 'headers'> {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export interface HttpClient {
  request<T>(path: string, config?: RequestConfig): Promise<T>;
  getBaseUrl(): string;
  getTenantAnonKey(): string | undefined;
}
