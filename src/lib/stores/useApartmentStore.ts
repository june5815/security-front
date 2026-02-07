import { create } from 'zustand';
import { getApartments } from '@/lib/api/apartments';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { ApartmentsDto, FindApartmentsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useApartmentStore = create<PaginatedStore<ApartmentsDto, FindApartmentsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getApartments,
    })
);

export default useApartmentStore;
