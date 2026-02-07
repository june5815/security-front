import { create } from 'zustand';
import { getResident } from '@/lib/api/residents';
import { createBaseStoreActions } from '@/lib/stores/actions';
import type { ResidentDto } from '@/lib/types';
import type { BaseStore } from '@/lib/stores/types';

type ResidentDetailParams = {
  id: string;
};

const useResidentDetailStore = create<BaseStore<ResidentDto, ResidentDetailParams>>(
  (set, get) =>
    createBaseStoreActions({
      set,
      get,
      fetchApi: async (params) => getResident(params.id),
    })
);

export default useResidentDetailStore;
