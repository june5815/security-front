import { create } from 'zustand';
import { getComplaints } from '@/lib/api/complaints';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { ComplaintsDto, FindComplaintsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useComplaintStore = create<PaginatedStore<ComplaintsDto, FindComplaintsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getComplaints,
    })
);

export default useComplaintStore;
