[giks@rogarch demo-saas]$ bun install
[0.02ms] ".env"
bun install v1.3.2 (b131639c)

+ auth-sdk@../auth-sdk

1 package installed [56.00ms]
[giks@rogarch demo-saas]$ bun run dev
$ next dev
▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.100.39:3000
- Environments: .env
- Experiments (use with caution):
  ✓ externalDir

✓ Starting...
⨯ ./src/services/iam/auth.service.ts:1:1
Module not found: Can't resolve 'auth-sdk'
> 1 | import { AuthSDK, SDKError, type SignInRequest, type SignUpRequest } from 'auth-sdk';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export type SignUpData = SignUpRequest;
  4 | export type SignInData = SignInRequest;

Invalid symlink

Debug info:
- Execution of <ModuleAssetContext as AssetContext>::resolve_asset failed
- Execution of resolve failed
- Execution of resolve_internal failed
- Execution of *ResolveResult::is_unresolvable failed
- Execution of *ResolveResult::with_replaced_request_key failed
- Execution of resolve_into_package failed
- Execution of exports_field failed
- Execution of read_package_json failed
- Execution of *AssetContent::parse_json failed
- Execution of <FileSource as Asset>::content failed
- Invalid symlink


Import trace:
  Middleware:
    ./src/services/iam/auth.service.ts
    ./src/proxy.ts

https://nextjs.org/docs/messages/module-not-found


⨯ ./src/services/iam/auth.service.ts:1:1
Module not found: Can't resolve 'auth-sdk'
> 1 | import { AuthSDK, SDKError, type SignInRequest, type SignUpRequest } from 'auth-sdk';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export type SignUpData = SignUpRequest;
  4 | export type SignInData = SignInRequest;

Invalid symlink

Debug info:
- Execution of <ModuleAssetContext as AssetContext>::resolve_asset failed
- Execution of resolve failed
- Execution of resolve_internal failed
- Execution of *ResolveResult::is_unresolvable failed
- Execution of *ResolveResult::with_replaced_request_key failed
- Execution of resolve_into_package failed
- Execution of exports_field failed
- Execution of read_package_json failed
- Execution of *AssetContent::parse_json failed
- Execution of <FileSource as Asset>::content failed
- Invalid symlink


Import trace:
  Middleware:
    ./src/services/iam/auth.service.ts
    ./src/proxy.ts

https://nextjs.org/docs/messages/module-not-found


⨯ ./src/services/iam/auth.service.ts:1:1
Module not found: Can't resolve 'auth-sdk'
> 1 | import { AuthSDK, SDKError, type SignInRequest, type SignUpRequest } from 'auth-sdk';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export type SignUpData = SignUpRequest;
  4 | export type SignInData = SignInRequest;

Invalid symlink

Debug info:
- Execution of <ModuleAssetContext as AssetContext>::resolve_asset failed
- Execution of resolve failed
- Execution of resolve_internal failed
- Execution of *ResolveResult::is_unresolvable failed
- Execution of *ResolveResult::with_replaced_request_key failed
- Execution of resolve_into_package failed
- Execution of exports_field failed
- Execution of read_package_json failed
- Execution of *AssetContent::parse_json failed
- Execution of <FileSource as Asset>::content failed
- Invalid symlink


Import trace:
  Middleware:
    ./src/services/iam/auth.service.ts
    ./src/proxy.ts

https://nextjs.org/docs/messages/module-not-found


✓ Ready in 379ms