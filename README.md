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
- Auth flows such as `signIn`, `signUp`, `refreshToken`, `logout`, `verifyToken`, `confirmRegistration`.
- Google integration helpers: `getGoogleAuthUrl()` to generate the redirect URL and `claimGoogle(code)` to exchange the ephemeral code returned by the backend for `{ token, refresh_token }`.
- All tenant-aware requests include the configured credential header (`Authorization: Bearer <anon_key>` by default or `apikey: <anon_key>`).
- Verification calls that return `{ is_valid: false }` trigger a reject so the consuming app can clear local session data.

## Cómo implementar paso a paso en un frontend (Next.js / React)

1. **Configura tu entorno**: crea un `.env.local` con `NEXT_PUBLIC_API_BASE=http://localhost:8081` y `NEXT_PUBLIC_TENANT_KEY=<anon_key>`. Asegúrate de que el backend esté corriendo y que el `anon_key` provenga de `/api/v1/tenants` (o de `GET /api/v1/tenants/{id}`).
2. **Inicializa el SDK** en un proveedor o hook compartido:
   ```ts
   import { AuthSDK } from 'auth-sdk';

   const sdk = useMemo(() => new AuthSDK({
     apiKey: process.env.NEXT_PUBLIC_TENANT_KEY!,
     baseUrl: process.env.NEXT_PUBLIC_API_BASE,
     credentialHeader: 'authorization',
   }), []);
   ```
3. **Login clásico**: llama a `sdk.auth.signIn({ email, password })`, guarda `token`/`refresh_token` (en memoria, cookie segura o `localStorage` cifrado) y úsalo para acceder a rutas protegidas. Maneja errores `TOKEN_VALIDATION_FAILED` borrando los datos y redirigiendo al login.
4. **Registro**: llama a `sdk.auth.signUp` con `{ email, password }`, muestra el mensaje de verificación enviado por email y bloquea el login hasta que el usuario confirme. No esperes tokens inmediatos.
5. **Refrescar/logout**: usa `sdk.auth.refreshToken(refreshToken)` antes de que expire el JWT y `sdk.auth.logout(refreshToken)` al cerrar sesión para que el backend invalide el refresh token.
6. **Recuperar contraseña**: `sdk.auth.forgotPassword(email)` y luego `sdk.auth.resetPassword(token, newPassword)` con el token que recibes en el correo.
7. **Google OAuth**:
   - Redirige al usuario a `sdk.auth.getGoogleAuthUrl()` (puedes abrirlo con `window.location.href`).
   - Google redirige a tu backend en `/api/v1/auth/google/callback`, que a su vez redirige de nuevo a tu frontend en `FRONTEND_URL/auth/google/callback?code=...`.
   - Captura ese `code` en la página de callback y llama a `sdk.auth.claimGoogle(code)` para recibir `{ token, refresh_token }`.
8. **Verificaciones**: puedes llamar a `sdk.auth.verifyToken(token)` al cargar páginas protegidas; el SDK rechaza automáticamente si el backend devuelve `is_valid: false` y así puedes limpiar sesiones.

Con estos pasos tienes un «playbook» completo para conectar Next.js (o cualquier SPA) con tu backend usando el SDK oficial y respetando los flujos multi-tenant documentados.

## Building & validation

- `npm run build`: emits CommonJS/ESM bundles plus `.d.ts` files via `tsup`.
- `npm run lint`: validates TypeScript without allowing `any`.
- The SDK uses strict typing, zero runtime dependencies, and works in Node and browser environments.