import { create } from 'zustand';
import { getNotice } from '@/lib/api/notices';
import { createBaseStoreActions } from '@/lib/stores/actions';
import { NoticeDetailDto } from '@/lib/types';
import type { BaseStore } from '@/lib/stores/types';

type NoticeDetailParams = {
  id: string;
};

const useNoticeDetailStore = create<BaseStore<NoticeDetailDto, NoticeDetailParams>>(
  (set, get) =>
    createBaseStoreActions({
      set,
      get,
      fetchApi: async (params) => getNotice(params.id),
    })
);

export default useNoticeDetailStore;
