import { Config, SDKOptions } from './core/config';
import { FetchClient } from './core/network/fetch-client';
import { AuthResource } from './resources/auth';
import { TenantsResource } from './resources/tenants';

export class AuthSDK {
  private readonly client: FetchClient;
  public readonly auth: AuthResource;
  public readonly tenants: TenantsResource;

  constructor(options: SDKOptions) {
    const config = new Config(options);
    this.client = new FetchClient(config);
    this.auth = new AuthResource(this.client);
    this.tenants = new TenantsResource(this.client);
  }
}

export * from './types/auth';
export * from './core/errors';
