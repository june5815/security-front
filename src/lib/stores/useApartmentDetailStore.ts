import { create } from 'zustand';
import { getApartment } from '@/lib/api/apartments';
import { createBaseStoreActions } from '@/lib/stores/actions';
import type { ApartmentsDto } from '@/lib/types';
import type { BaseStore } from '@/lib/stores/types';

type ApartmentDetailParams = {
  id: string;
};

const useApartmentDetailStore = create<BaseStore<ApartmentsDto, ApartmentDetailParams>>(
  (set, get) =>
    createBaseStoreActions({
      set,
      get,
      fetchApi: async (params) => getApartment(params.id),
    })
);

export default useApartmentDetailStore;
