export interface SDKOptions {
  /** Tenant anon key (preferred). */
  tenantAnonKey?: string;
  /** Legacy alias for tenantAnonKey. */
  apiKey?: string;
  /** Base URL for the auth backend */
  baseUrl: string;
  /** Milliseconds to wait before aborting requests */
  timeout?: number;
  /** Additional headers appended to every request */
  headers?: Record<string, string>;
}

export class Config {
  private static readonly DEFAULT_TIMEOUT = 10_000;
  readonly tenantAnonKey?: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly headers: Record<string, string>;

  constructor(options: SDKOptions) {
    if (!options.baseUrl) {
      throw new Error("SDK Initialization Error: 'baseUrl' is required.");
    }

    this.tenantAnonKey = options.tenantAnonKey ?? options.apiKey;
    this.timeout = options.timeout ?? Config.DEFAULT_TIMEOUT;
    this.baseUrl = Config.normalizeBaseUrl(options.baseUrl);
    this.headers = Object.freeze({ ...(options.headers ?? {}) });
  }

  private static normalizeBaseUrl(rawUrl: string): string {
    try {
      const url = new URL(rawUrl);
      return url.href.replace(/\/$/, '');
    } catch (_error) {
      throw new Error(`SDK Initialization Error: baseUrl '${rawUrl}' is not a valid URL.`);
    }
  }
}
