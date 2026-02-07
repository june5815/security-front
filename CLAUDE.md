# Project WeLive Frontend - Development Guide

This document provides a quick reference to the key patterns and conventions used in this project.

## Documentation Structure

- **[docs/1_api-layer.md](./docs/1_api-layer.md)** - API client patterns and type import rules
- **[docs/2_store.md](./docs/2_store.md)** - State management and store architecture
- **[docs/3_openapi-typescript.md](./docs/3_openapi-typescript.md)** - OpenAPI TypeScript type generation

## Core Principles - MUST FOLLOW

### 1. Type Imports
```typescript
// CORRECT - Always import from @/lib/types
import type { LoginRequestDto, UserRole } from '@/lib/types';

// WRONG - Never import from @/lib/types/api
import type { components } from '@/lib/types/api';
```

**Rule**: `@/lib/types` is the **single source of truth** for ALL type imports.

See: [docs/1_api-layer.md](./docs/1_api-layer.md#type-import-rules---must-follow)

### 2. API Client Usage
```typescript
// CORRECT - Use centralized client
import { apiClient } from '@/lib/api/client';

export const getUsers = (params: FindUsersParams) => {
  return apiClient.get('/users', { params });
};
```

**Rule**: All API calls must use the centralized `apiClient` from `src/lib/api/client.ts`.

See: [docs/1_api-layer.md](./docs/1_api-layer.md#api-client-pattern---must-follow)

### 3. Store Patterns
```typescript
// CORRECT - Use factory functions
import { createPaginatedStoreActions } from '@/lib/stores/actions';

const useUserStore = create<PaginatedStore<UserDto, FindUsersParams>>((set, get) =>
  createPaginatedStoreActions({
    set,
    get,
    fetchApi: getUsers,
    initialData: { params: { limit: 20 } },
  })
);
```

**Rule**: Use `createPaginatedStoreActions` for paginated data stores.

See: [docs/2_store.md](./docs/2_store.md#paginatedstore-implementation-pattern)

### 4. OpenAPI Type Generation
```bash
# After updating docs/openapi.json
npm run generate:types
```

**Rule**: Always regenerate types after API spec changes. All types are auto-generated from OpenAPI spec.

See: [docs/3_openapi-typescript.md](./docs/3_openapi-typescript.md)

## Project Structure

```
src/
├── lib/
│   ├── api/              # API modules (auth.ts, users.ts, etc.)
│   │   └── client.ts     # Centralized Axios client
│   ├── types/            # Type definitions
│   │   ├── api.d.ts      # Auto-generated from OpenAPI (DO NOT EDIT)
│   │   └── index.ts      # Single source of truth for type exports
│   └── stores/           # Zustand stores
│       ├── actions.ts    # Store factory functions
│       ├── types.ts      # Store type definitions
│       └── utils.ts      # Store utilities (execute, etc.)
├── entities/             # Domain-organized features
└── shared/               # Shared utilities and components

docs/
├── openapi.json          # OpenAPI 3.0 specification
├── 1_api-layer.md        # API patterns and type rules
├── 2_store.md            # State management patterns
└── 3_openapi-typescript.md  # Type generation guide
```

## Quick Start Checklist

When starting a new feature:

- [ ] Check `docs/openapi.json` for available API endpoints
- [ ] Run `npm run generate:types` if API spec changed
- [ ] Import types from `@/lib/types` only
- [ ] Create API module in `src/lib/api/` using `apiClient`
- [ ] Create store in `src/lib/stores/` using factory functions
- [ ] Build UI components using store hooks

## Common Tasks

### Adding a New API Endpoint

1. **Update OpenAPI spec**: Modify `docs/openapi.json`
2. **Generate types**: `npm run generate:types`
3. **Export types**: Add to `src/lib/types/index.ts` if needed
4. **Create API function**: Add to appropriate `src/lib/api/*.ts` file
5. **Create/Update store**: Use `createPaginatedStoreActions` or similar

### Adding a New Type

**Don't manually create types!** All types come from OpenAPI:

1. Add the type to `docs/openapi.json` schema
2. Run `npm run generate:types`
3. Export it from `src/lib/types/index.ts`

### Debugging Type Issues

- **Check**: Are you importing from `@/lib/types`? (not `@/lib/types/api`)
- **Check**: Did you run `npm run generate:types` after API changes?
- **Check**: Is the type exported from `src/lib/types/index.ts`?

## Key File Locations

| Purpose | Location |
|---------|----------|
| API Specification | `docs/openapi.json` |
| Generated Types | `src/lib/types/api.d.ts` |
| Type Exports | `src/lib/types/index.ts` |
| API Client | `src/lib/api/client.ts` |
| Store Utilities | `src/lib/stores/actions.ts` |

## Best Practices

1. **Type Safety**: Let TypeScript guide you - if types don't match, check the OpenAPI spec
2. **DRY**: Use factory functions for stores instead of duplicating logic
3. **Single Source of Truth**: OpenAPI spec → Generated types → All code
4. **Consistency**: Follow existing patterns in similar files
5. **Documentation**: When adding complex logic, update relevant docs

## Development Workflow

```
1. Update OpenAPI spec (docs/openapi.json)
   ↓
2. Generate types (npm run generate:types)
   ↓
3. Export types (src/lib/types/index.ts)
   ↓
4. Implement API module (src/lib/api/)
   ↓
5. Implement store (src/lib/stores/)
   ↓
6. Build UI components
```

## Common Pitfalls

- Importing from `@/lib/types/api` directly
- Manually creating types instead of using OpenAPI
- Not running `generate:types` after API changes
- Creating custom HTTP clients instead of using `apiClient`
- Duplicating store logic instead of using factories

---

**For detailed information on any pattern, refer to the linked documentation files.**
