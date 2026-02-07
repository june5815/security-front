
## API Layer

### API Client Pattern - MUST FOLLOW
- **Single centralized HTTP client** at `src/lib/api/client.ts` (Axios-based)
- **Automatic JWT token injection and refresh**
- **All API modules use this client** for consistency
- Domain-organized API modules: `auth.ts`, `users.ts`, `residents.ts`, `apartments.ts`, etc.
- OpenAPI spec available in `docs/openapi.json` for backend contract
- **TypeScript types auto-generated** from OpenAPI spec using `openapi-typescript`

**See**: [3_openapi-typescript.md](./3_openapi-typescript.md) for details on type generation workflow

### Type Import Rules - MUST FOLLOW

**RULE: ONLY import types from `@/lib/types`. NEVER import from `@/lib/types/api`**

`@/lib/types` is the **single source of truth** for all type imports across the entire codebase.

#### ✅ CORRECT Pattern
```typescript
// API modules - use pre-exported query parameter types
import type {
  UserDto,
  UserCreateRequest,
  CursorResponseUserDto,
  FindUsersParams,  // ✅ Pre-defined query params
} from '@/lib/types';
```

```typescript
// Store modules
import type {
  ContentDto,
  CursorResponseContentDto,
  FindContentsParams,
} from '@/lib/types';
```

```typescript
// Components
import type { PlaylistDto, UserSummary } from '@/lib/types';
```

#### ❌ WRONG Pattern
```typescript
// NEVER import directly from api.ts
import type { components } from '@/lib/types/api'; // ❌ WRONG
import type { operations } from '@/lib/types/api'; // ❌ WRONG
import type { paths } from '@/lib/types/api'; // ❌ WRONG

// NEVER use operations/components from @/lib/types
import type { operations } from '@/lib/types'; // ❌ WRONG
type Params = operations['findUsers']['parameters']['query']; // ❌ WRONG
```

#### Why This Rule Exists
1. **Single Source of Truth**: All type imports go through one entry point (`@/lib/types`)
2. **Encapsulation**: `@/lib/types/api` is an internal implementation detail
3. **Store Compatibility**: Stores, API modules, and components all use the same import path
4. **Pre-defined Types**: All commonly used types (including query params) are pre-exported
5. **Maintainability**: Type changes only need to be managed in `@/lib/types/index.ts`

#### Available Type Exports from `@/lib/types`

All types are **auto-generated from OpenAPI spec** (`docs/openapi.json`) and exported via `@/lib/types/index.ts`:

- **Schema types (DTOs)**: `LoginRequestDto`, `NoticeDetailResponseDto`, `ApartmentResponseDto`, etc.
- **Request types**: `CreateNoticeDto`, `UpdateResidentDto`, `SignupUserRequestDto`, etc.
- **Response types**: `LoginResponseDto`, `NoticesListWrapperDto`, `ComplaintsListResponseDto`, etc.
- **Query parameter types**: `FindResidentsParams`, `FindNoticesParams`, `FindPollsParams`, etc.
- **Enum/Union types**: `UserRole`, `JoinStatus`, `ComplaintStatus`, `PollStatus`, etc.
- **Common types**: `MessageResponseDto`, `ErrorResponse`, `PaginatedResponse`, etc.

**Note**: If you need a type that's not exported, add it to `@/lib/types/index.ts` rather than importing from `@/lib/types/api`.

**For complete type catalog**: See [3_openapi-typescript.md](./3_openapi-typescript.md#available-type-exports)