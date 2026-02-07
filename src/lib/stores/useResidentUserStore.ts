import { create } from 'zustand';
import { getResidentUsers } from '@/lib/api/users';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { ResidentUserDto, FindResidentUsersParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useResidentUserStore = create<PaginatedStore<ResidentUserDto, FindResidentUsersParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getResidentUsers,
    })
);

export default useResidentUserStore;
