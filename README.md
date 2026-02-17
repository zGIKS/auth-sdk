# asphanyx-sdk

TypeScript SDK for client-side authentication flows against the IAM backend.

## Scope

This SDK is intentionally limited to tenant-aware auth endpoints:

- `signIn`
- `signUp`
- `refreshToken`
- `logout`
- `verifyToken`
- `forgotPassword`
- `resetPassword`
- `getGoogleAuthUrl`
- `claimGoogle`
- `getConfirmRegistrationUrl`

Tenant administration endpoints are not part of this package.

## Install

```bash
npm install asphanyx-sdk
```

## Usage

```ts
import { AuthSDK } from 'asphanyx-sdk';

const sdk = new AuthSDK({
  apiKey: process.env.NEXT_PUBLIC_TENANT_ANON_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_AUTH_API_BASE!,
});

const session = await sdk.auth.signIn({
  email: 'user@example.com',
  password: 'strong-password',
});
```

## Security notes

- Do not place backend secrets (for example `JWT_SECRET`, SMTP credentials, DB URLs) in frontend env variables.
- The SDK only needs:
  - `baseUrl` (public API URL)
  - `apiKey` (`anon_key` for tenant routing)
- Store user access/refresh tokens in secure storage on your frontend.

## Development

```bash
npm install
npm run build
npm run lint
```

## Publish

```bash
npm publish --access public
```
