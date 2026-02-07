import { create } from 'zustand';
import { getNotifications } from '@/lib/api/notifications';
import { createPaginatedStoreActions } from '@/lib/stores/actions';
import type { NotificationDto, FindNotificationsParams } from '@/lib/types';
import type { PaginatedStore } from '@/lib/stores/types';

const useNotificationStore = create<PaginatedStore<NotificationDto, FindNotificationsParams>>(
  (set, get) =>
    createPaginatedStoreActions({
      set,
      get,
      fetchApi: getNotifications,
    })
);

export default useNotificationStore;
