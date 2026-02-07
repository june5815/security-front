import { create } from 'zustand';
import { getPoll } from '@/lib/api/polls';
import { createBaseStoreActions } from '@/lib/stores/actions';
import type { PollDetailDto } from '@/lib/types';
import type { BaseStore } from '@/lib/stores/types';

type PollDetailParams = {
  id: string;
};

const usePollDetailStore = create<BaseStore<PollDetailDto, PollDetailParams>>(
  (set, get) =>
    createBaseStoreActions({
      set,
      get,
      fetchApi: async (params) => getPoll(params.id),
    })
);

export default usePollDetailStore;
