## OpenAPI TypeScript Integration

### Overview

This project uses **[openapi-typescript](https://openapi-ts.dev/)** to automatically generate TypeScript types from the OpenAPI 3.0 specification. This ensures type safety and eliminates manual type definition maintenance.

**Key Benefits**:
- **Single Source of Truth**: API contract (OpenAPI spec) → TypeScript types
- **Type Safety**: Compile-time validation of API requests/responses
- **Auto-sync**: Types automatically update when API spec changes
- **Zero Manual Maintenance**: No need to manually write or update DTO types

### File Structure

```
docs/
└── openapi.json              # OpenAPI 3.0 spec (source of truth)

src/lib/types/
├── api.d.ts                  # Auto-generated types (DO NOT EDIT)
└── index.ts                  # Single source of truth for imports
```

**Important**:
- `api.d.ts` is **auto-generated** - never edit it manually
- `index.ts` is the **only file** you should import from

---

## Setup & Configuration

### Installation

```bash
npm install -D openapi-typescript
```

### NPM Script

```json
{
  "scripts": {
    "generate:types": "openapi-typescript docs/openapi.json -o src/lib/types/api.d.ts"
  }
}
```

### Type Generation Workflow

```bash
# After updating docs/openapi.json
npm run generate:types
```

This command:
1. Reads `docs/openapi.json` (OpenAPI 3.0 spec)
2. Generates `src/lib/types/api.d.ts` with:
   - `paths` - All API endpoints
   - `components` - Schema definitions (DTOs)
   - `operations` - Request/response types for each endpoint
3. Types are ready to use via `@/lib/types`

---

## Type Import Rules - MUST FOLLOW

### ✅ CORRECT Pattern

**RULE: ALWAYS import from `@/lib/types`. NEVER import from `@/lib/types/api`**

```typescript
// API modules
import type {
  LoginRequestDto,
  LoginResponseDto,
  FindNoticesParams,
} from '@/lib/types';

// Store modules
import type {
  NoticeDetailResponseDto,
  CreateNoticeDto,
} from '@/lib/types';

// Components
import type {
  UserRole,
  JoinStatus,
  ApartmentResponseDto,
} from '@/lib/types';
```

### ❌ WRONG Pattern

```typescript
// NEVER import directly from api.d.ts
import type { components } from '@/lib/types/api'; // ❌ WRONG
import type { operations } from '@/lib/types/api'; // ❌ WRONG

// NEVER use operations/components directly
import type { operations } from '@/lib/types';
type Params = operations['NoticesController_findAll']['parameters']['query']; // ❌ WRONG

// NEVER manually access nested paths
type LoginDto = components['schemas']['LoginRequestDto']; // ❌ WRONG
```

### Why This Rule Exists

1. **Encapsulation**: `api.d.ts` is an internal implementation detail
2. **Single Import Path**: All code uses the same import source (`@/lib/types`)
3. **Maintainability**: Type exports are centrally managed in `index.ts`
4. **Readability**: Clean, short type names instead of nested paths
5. **Flexibility**: Can extend or alias types without affecting consumers

---

## Available Type Exports

### 1. Schema Types (DTOs)

All request/response DTOs are exported from `@/lib/types`:

#### Auth Related
```typescript
import type {
  SignupUserRequestDto,
  SignupUserResponseDto,
  SignupAdminRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  UpdateStatusDto,
  ChangePasswordDto,
} from '@/lib/types';
```

#### Apartment & Resident Management
```typescript
import type {
  ApartmentResponseDto,
  ApartmentListResponseDto,
  ApartmentSummaryDto,
  ResidentResponseDto,
  CreateOneResidentDto,
  UpdateResidentDto,
} from '@/lib/types';
```

#### Content (Notice, Poll, Complaint)
```typescript
import type {
  NoticeDetailResponseDto,
  CreateNoticeDto,
  UpdateNoticeDto,
  PollFindOneResponseDto,
  CreatePollDto,
  ComplaintsResponseDto,
  CreateComplaintDto,
} from '@/lib/types';
```

#### Comments & Notifications
```typescript
import type {
  CommentResponseDto,
  CreateCommentDto,
  NotificationDto,
} from '@/lib/types';
```

#### Common Response Types
```typescript
import type {
  MessageResponseDto,
  CreateResponseDto,
  DeleteResponseDto,
  BulkOperationResponseDto,
} from '@/lib/types';
```

### 2. Query Parameter Types

Query parameters are extracted from `operations` and exported:

```typescript
import type {
  FindResidentsParams,       // Resident list filters
  FindApartmentsParams,       // Apartment search
  FindNoticesParams,          // Notice filters
  FindPollsParams,            // Poll filters
  FindComplaintsParams,       // Complaint filters
  GetEventsParams,            // Event calendar params
} from '@/lib/types';
```

**Example Usage**:
```typescript
import { apiClient } from '@/lib/api/client';
import type { FindNoticesParams, NoticesListWrapperDto } from '@/lib/types';

export const getNotices = async (params: FindNoticesParams) => {
  const response = await apiClient.get<NoticesListWrapperDto>('/notices', { params });
  return response.data;
};
```

### 3. Enum & Union Types

Status and role enums extracted from DTOs:

```typescript
import type {
  UserRole,              // "SUPER_ADMIN" | "ADMIN" | "USER"
  JoinStatus,            // "PENDING" | "APPROVED" | "REJECTED" | "NEED_UPDATE"
  ApartmentStatus,       // "PENDING" | "APPROVED" | "REJECTED"
  ResidenceStatus,       // "RESIDENCE" | "NO_RESIDENCE"
  NoticeCategory,        // "MAINTENANCE" | "EMERGENCY" | "COMMUNITY" | ...
  ComplaintStatus,       // "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  PollStatus,            // "PENDING" | "IN_PROGRESS" | "CLOSED"
  NotificationType,      // "GENERAL" | "SIGNUP_REQ" | "COMPLAINT_REQ" | ...
  EventType,             // "NOTICE" | "POLL"
} from '@/lib/types';
```

### 4. Utility Types

```typescript
import type {
  PaginatedResponse,     // Generic paginated wrapper
  ErrorResponse,         // Standard error response
} from '@/lib/types';
```

---

## Integration with API Layer

### Pattern: API Module with Generated Types

**File**: `src/lib/api/notices.ts`

```typescript
import { apiClient } from './client';
import type {
  NoticeDetailResponseDto,
  NoticesListWrapperDto,
  CreateNoticeDto,
  UpdateNoticeDto,
  FindNoticesParams,
  MessageResponseDto,
} from '@/lib/types';

// List with filters
export const getNotices = async (params?: FindNoticesParams) => {
  const response = await apiClient.get<NoticesListWrapperDto>('/notices', { params });
  return response.data;
};

// Get single notice
export const getNotice = async (noticeId: string) => {
  const response = await apiClient.get<NoticeDetailResponseDto>(`/notices/${noticeId}`);
  return response.data;
};

// Create notice
export const createNotice = async (data: CreateNoticeDto) => {
  const response = await apiClient.post<{ id: string }>('/notices', data);
  return response.data;
};

// Update notice
export const updateNotice = async (noticeId: string, data: UpdateNoticeDto) => {
  const response = await apiClient.patch<UpdateNoticeDto>(`/notices/${noticeId}`, data);
  return response.data;
};

// Delete notice
export const deleteNotice = async (noticeId: string) => {
  const response = await apiClient.delete<MessageResponseDto>(`/notices/${noticeId}`);
  return response.data;
};
```

**Key Points**:
- ✅ All types imported from `@/lib/types`
- ✅ Request/response types match OpenAPI spec exactly
- ✅ TypeScript validates params, body, and response shapes
- ✅ No manual type definitions needed

---

## Best Practices

### 1. Always Regenerate After API Changes

```bash
# Workflow when backend updates API
git pull                      # Get latest openapi.json
npm run generate:types        # Regenerate types
npm run build                 # Check for type errors
```

### 2. Add New Types to index.ts

If you need a type that's not yet exported:

```typescript
// src/lib/types/index.ts

// Add the export
export type NewTypeDto = components['schemas']['NewTypeDto'];

// Or extract from operations
export type NewQueryParams = operations['ControllerName_methodName']['parameters']['query'];
```

**Don't create manual types!** Always source from `api.d.ts`.

### 3. Nested Types

Some DTOs have nested types (e.g., `SignupUserRequestDto$Apartment`). These are also exported:

```typescript
import type {
  SignupUserRequestDto,
  SignupUserApartment,  // Alias for SignupUserRequestDto$Apartment
} from '@/lib/types';
```

### 4. Type Safety with API Calls

```typescript
// ❌ BAD - No type safety
const response = await apiClient.get('/notices');
const notices = response.data; // Type: any

// ✅ GOOD - Full type safety
import type { NoticesListWrapperDto } from '@/lib/types';
const response = await apiClient.get<NoticesListWrapperDto>('/notices');
const notices = response.data; // Type: NoticesListWrapperDto
```

### 5. Error Handling with Types

```typescript
import type { ErrorResponse } from '@/lib/types';

try {
  await createNotice(data);
} catch (error: any) {
  const apiError = error.response?.data as ErrorResponse;
  console.error(apiError.message, apiError.statusCode);
}
```

---

## Troubleshooting

### Type Not Found Error

**Problem**: `Cannot find name 'SomeDto'`

**Solution**:
1. Check if it exists in `api.d.ts` under `components.schemas`
2. If yes, add export to `src/lib/types/index.ts`
3. If no, update `docs/openapi.json` and run `npm run generate:types`

### Type Mismatch Error

**Problem**: API response doesn't match type

**Solution**:
1. Check if `docs/openapi.json` is up to date with backend
2. Run `npm run generate:types`
3. If still failing, backend API may have changed without updating spec

### Import Error

**Problem**: `Module '"@/lib/types"' has no exported member 'SomeType'`

**Solution**:
- Check if you're importing from `@/lib/types` (not `@/lib/types/api`)
- Check if the type is exported in `src/lib/types/index.ts`
- Check spelling - type names are case-sensitive

---

## Advanced: Understanding Generated Types

### Structure of api.d.ts

```typescript
// src/lib/types/api.d.ts (auto-generated)

export interface paths {
  "/api/notices": {
    get: operations["NoticesController_findAll"];
    post: operations["NoticesController_create"];
  };
  // ... all endpoints
}

export interface components {
  schemas: {
    NoticeDetailResponseDto: {
      id: string;
      title: string;
      content: string;
      // ... all fields
    };
    // ... all DTOs
  };
}

export interface operations {
  NoticesController_findAll: {
    parameters: {
      query?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["NoticesListWrapperDto"];
        };
      };
    };
  };
  // ... all operations
}
```

### How index.ts Works

```typescript
// src/lib/types/index.ts

import type { components, operations } from './api';

// Re-export for advanced usage
export type { components, operations };

// Extract and export schema types
export type NoticeDetailResponseDto = components['schemas']['NoticeDetailResponseDto'];

// Extract and export query params from operations
export type FindNoticesParams = operations['NoticesController_findAll']['parameters']['query'];

// Extract enum types from DTOs
export type NoticeCategory = NoticeDetailResponseDto['category'];
```

This pattern:
- ✅ Centralizes all type exports
- ✅ Provides clean, short names
- ✅ Maintains single source of truth
- ✅ Allows type extensions without affecting consumers

---

## Summary

| Do | Don't |
|----|-------|
| ✅ Import from `@/lib/types` | ❌ Import from `@/lib/types/api` |
| ✅ Run `generate:types` after API changes | ❌ Manually edit `api.d.ts` |
| ✅ Add exports to `index.ts` if needed | ❌ Create manual type definitions |
| ✅ Use generated types in API modules | ❌ Use `any` or untyped responses |
| ✅ Keep `openapi.json` up to date | ❌ Let types drift from backend |

**Remember**: The OpenAPI spec is the single source of truth. Let TypeScript guide you!
