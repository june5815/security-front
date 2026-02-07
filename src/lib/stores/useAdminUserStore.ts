import { create } from 'zustand';
import { getAdminUsers } from '@/lib/api/users';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { AdminUserDto, FindAdminsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useAdminUserStore = create<PaginatedStore<AdminUserDto, FindAdminsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getAdminUsers,
    })
);

export default useAdminUserStore;
