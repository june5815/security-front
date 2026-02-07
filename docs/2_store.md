## State Management

### Store Architecture
All stores follow standardized interfaces:
- `BaseStore<T>` - Base store interface
- `ListStore<T>` - For list data
- `PaginatedStore<T>` - For paginated data

### Creating Stores - Implementation Patterns

#### When to Use Each Store Type

**PaginatedStore<T, P extends CursorParams>** - Use for cursor-paginated API endpoints
- APIs that return `CursorResponse` (with `nextCursor`, `hasNext`, `totalCount`)
- Examples: User lists, content lists, playlist lists
- Supports infinite scroll and "load more" patterns

**ListStore<T, P>** - Use for simple list data without pagination
- APIs that return arrays directly
- Small datasets that don't need pagination
- Examples: Tags, categories, settings lists

**BaseStore<T, P>** - Use for single resource/object
- APIs that return a single object
- Examples: User profile, single content item, configuration

#### PaginatedStore Implementation Pattern

**MUST FOLLOW**: All paginated stores use the `createPaginatedStoreActions` factory from `@/lib/stores/actions.ts`

```typescript
// Example: src/lib/stores/useUserStore.ts
import { create } from 'zustand';
import { getUsers } from '@/lib/api/users';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { UserDto, FindUsersParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useUserStore = create<PaginatedStore<UserDto, FindUsersParams>>((set, get) =>
  createPaginatedStoreActions<UserDto, FindUsersParams>({
    set,
    get,
    fetchApi: getUsers,              // API function that returns CursorResponse
    initialData: {
      params: { limit: 20 },          // Default query parameters
    },
    // keyExtractor: (user) => user.id  // Optional: only if key is NOT 'id'
  })
);

export default useUserStore;
```

**Key Points**:
1. **Type Imports**: Import types from `@/lib/types` and `PaginatedStore` from `@/lib/stores/types`
2. **fetchApi**: Must be a function that accepts params and returns a `Promise<CursorResponse>`
3. **initialData.params**: Set default pagination (`limit`) and other query params
4. **keyExtractor**: Default extracts `id` property. Only override if using different key name

#### Available Store Methods

**Data Fetching**:
- `fetch(options?)` - Fetch first page (resets data)
- `fetchMore(options?)` - Fetch next page (appends to data)
- `hasNext()` - Returns boolean indicating if more data available
- `count()` - Returns total count from cursor response

**Data Mutations** (for optimistic updates after CUD operations):
- `add(newItem)` - Add item to list (respects sorting, prevents duplicates)
- `update(id, partialData)` - Update existing item
- `delete(id)` - Remove item from list

**State Management**:
- `data` - Array of items (type `T[]`)
- `loading` - Boolean loading state
- `error` - Error message string or undefined
- `params` - Current query parameters
- `updateParams(newParams, options?)` - Update params and auto-fetch
- `cursorState` - Pagination state (`nextCursor`, `nextIdAfter`, `hasNext`, `totalCount`)

**Cleanup**:
- `clear()` - Clear both data and error
- `clearData()` - Reset data to initial state
- `clearError()` - Clear error message

#### Usage Example in Components

```tsx
import useUserStore from '@/lib/stores/useUserStore';
import { createUser } from '@/lib/api/users';

function UserListPage() {
  const { data, loading, error, fetch, fetchMore, hasNext, updateParams } = useUserStore();

  // Initial fetch
  useEffect(() => {
    fetch();
  }, []);

  // Search/filter
  const handleSearch = (email: string) => {
    updateParams({ emailLike: email }); // Auto-fetches with new params
  };

  // Load more (infinite scroll)
  const handleLoadMore = () => {
    if (hasNext() && !loading) {
      fetchMore();
    }
  };

  // CUD operation example
  const handleCreateUser = async (userData: UserCreateRequest) => {
    try {
      // 1. Call API directly
      const newUser = await createUser(userData);

      // 2. Sync store state
      useUserStore.getState().add(newUser);

      toast.success('User created');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <div>
      {data.map(user => <UserCard key={user.id} user={user} />)}
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
```

### Store Pattern - MUST FOLLOW
All stores use the `execute()` utility from `src/lib/stores/utils.ts` for consistent async action handling:

```typescript
// Example from useAuthStore.ts
await execute(
  set, get,
  () => signIn({ username, password }),
  { shouldThrow: true }
)
```

### Authentication
- **Central auth state** managed in `useAuthStore`
- **Automatic token refresh** handled by store
- All authenticated requests use tokens from auth store
