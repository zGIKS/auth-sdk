import { Config } from '../config';
import { HttpClient, RequestConfig } from './http-client';
import { SDKError, NetworkError } from '../errors';

export class FetchClient implements HttpClient {
  constructor(private readonly config: Config) {}

  async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(path, config.params);
    const controller = new AbortController();
    const hasExternalSignal = Boolean(config.signal);
    const signal = config.signal ?? controller.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!hasExternalSignal) {
      timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    }

    try {
      const response = await fetch(url.toString(), {
        ...config,
        method: config.method ?? 'GET',
        headers: this.mergeHeaders(config.headers),
        signal,
      });

      if (!response.ok) {
        throw await SDKError.fromResponse(response);
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      const payload = await response.text();
      if (!payload) {
        return {} as T;
      }

      return JSON.parse(payload) as T;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('Request timed out.');
      }
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number>): URL {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.config.baseUrl}${normalizedPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url;
  }

  private mergeHeaders(requestHeaders?: Record<string, string>): Record<string, string> {
    const credentialHeader: Record<string, string> =
      this.config.credentialHeader === 'apikey'
        ? { apikey: this.config.apiKey }
        : { Authorization: `Bearer ${this.config.apiKey}` };

    return {
      ...credentialHeader,
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...requestHeaders,
    };
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
