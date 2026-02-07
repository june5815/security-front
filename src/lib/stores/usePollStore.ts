import { create } from 'zustand';
import { getPolls } from '@/lib/api/polls';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { PollDto, FindPollsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const usePollStore = create<PaginatedStore<PollDto, FindPollsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getPolls,
    })
);

export default usePollStore;
