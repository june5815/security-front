import { create } from 'zustand';
import { getResidents } from '@/lib/api/residents';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { ResidentDto, FindResidentsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useResidentStore = create<PaginatedStore<ResidentDto, FindResidentsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getResidents,
    })
);

export default useResidentStore;
