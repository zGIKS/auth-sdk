export type CredentialHeaderStrategy = 'authorization' | 'apikey';

export interface SDKOptions {
  /** apiKey in this context is the anon_key issued per tenant */
  apiKey: string;
  /** Base URL for the auth backend */
  baseUrl: string;
  /** Milliseconds to wait before aborting requests */
  timeout?: number;
  /** Additional headers appended to every request */
  headers?: Record<string, string>;
  /** Header strategy used to deliver the tenant anon_key */
  credentialHeader?: CredentialHeaderStrategy;
}

export class Config {
  private static readonly DEFAULT_TIMEOUT = 10_000;
  private static readonly DEFAULT_HEADER_STRATEGY: CredentialHeaderStrategy = 'authorization';

  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly headers: Record<string, string>;
  readonly credentialHeader: CredentialHeaderStrategy;

  constructor(options: SDKOptions) {
    if (!options.apiKey) {
      throw new Error("SDK Initialization Error: 'apiKey' (anon_key) is required.");
    }
    if (!options.baseUrl) {
      throw new Error("SDK Initialization Error: 'baseUrl' is required.");
    }

    this.apiKey = options.apiKey;
    this.timeout = options.timeout ?? Config.DEFAULT_TIMEOUT;
    this.baseUrl = Config.normalizeBaseUrl(options.baseUrl);
    this.headers = Object.freeze({ ...(options.headers ?? {}) });
    this.credentialHeader = options.credentialHeader ?? Config.DEFAULT_HEADER_STRATEGY;
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
