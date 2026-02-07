import { create } from 'zustand';
import { getComplaint } from '@/lib/api/complaints';
import { createBaseStoreActions } from '@/lib/stores/actions';
import type { ComplaintsDto } from '@/lib/types';
import type { BaseStore } from '@/lib/stores/types';

type ComplaintDetailParams = {
  id: string;
};

const useComplaintDetailStore = create<BaseStore<ComplaintsDto, ComplaintDetailParams>>(
  (set, get) =>
    createBaseStoreActions({
      set,
      get,
      fetchApi: async (params) => getComplaint(params.id),

    })
);

export default useComplaintDetailStore;
