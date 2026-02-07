import { create } from 'zustand';
import { getComments } from '@/lib/api/comments';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { CommentDto, FindCommentsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useCommentStore = create<PaginatedStore<CommentDto, FindCommentsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getComments,
    })
);

export default useCommentStore;
