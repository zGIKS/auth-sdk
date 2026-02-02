# Auth SDK

TypeScript SDK that wraps the IAM auth backend described in this repo. The SDK follows the tenant-aware middleware expectations and keeps the tenant `anon_key` (JWT signed with `JWT_SECRET`) inside the configured credential header.

## Getting started

1. Install the SDK dependencies:
   ```bash
   npm install
   ```
2. Build the SDK before publishing or importing it from another workspace:
   ```bash
   npm run build
   ```

## Configuration

This SDK expects the backend to run at `http://localhost:8081` by default and to expose the following `.env` settings:

| Variable | Development value | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgres://postgres:admin@localhost:5432/saas_auth` | Tenant-aware Postgres connection |
| `PORT` | `8081` | HTTP port that matches this SDK's base URL |
| `REDIS_URL` | `redis://localhost:6379` | Session store and token blacklist |
| `JWT_SECRET` | `super_secret_jwt_key_for_local_dev_123456789` | Same secret must issue `anon_key` and tokens |
| `FRONTEND_URL` | `http://localhost:3000` | Used for e-mail redirects |
| `GOOGLE_REDIRECT_URI` | `http://localhost:8081/api/v1/auth/google/callback` | OAuth callback target |

When constructing the SDK you must pass in the `anon_key` returned by `POST /api/v1/tenants` or the environment equivalent.

## Usage example

```ts
import { AuthSDK, SignInRequest } from 'auth-sdk';

const sdk = new AuthSDK({
  apiKey: process.env.ANON_KEY!,
  baseUrl: 'http://localhost:8081',
  credentialHeader: 'authorization',
});

const signInPayload: SignInRequest = {
  email: 'admin@example.com',
  password: 'strong-password',
};

const auth = await sdk.auth.signIn(signInPayload);
console.log('token', auth.token);
```

> The SDK automatically verifies every new token via `GET /api/v1/auth/verify?token=` and surfaces a `TOKEN_VALIDATION_FAILED` error if the backend deems the token invalid.

## Supported flows

- Tenant creation / lookup via `sdk.tenants.create` and `sdk.tenants.get` (requires Authorization/apikey header with tenant's `anon_key`).
- Auth flows such as `signIn`, `signUp`, `refreshToken`, `logout`, `verifyToken`, `confirmRegistration`, and Google callbacks.
- All tenant-aware requests include the configured credential header (`Authorization: Bearer <anon_key>` by default or `apikey: <anon_key>`).
- Verification calls that return `{ is_valid: false }` trigger a reject so the consuming app can clear local session data.

## Building & validation

- `npm run build`: emits CommonJS/ESM bundles plus `.d.ts` files via `tsup`.
- `npm run lint`: validates TypeScript without allowing `any`.
- The SDK uses strict typing, zero runtime dependencies, and works in Node and browser environments.
