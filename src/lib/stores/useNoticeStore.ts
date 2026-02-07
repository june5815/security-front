import { create } from 'zustand';
import { getNotices } from '@/lib/api/notices';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { NoticeDto, FindNoticesParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useNoticeStore = create<PaginatedStore<NoticeDto, FindNoticesParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getNotices,
    })
);

export default useNoticeStore;
