import { create } from 'zustand';
import { getEvents } from '@/lib/api/events';
import { createListStoreActions } from '@/lib/stores/actions';
import type { EventDto, FindEventsParams } from '@/lib/types';
import type { ListStore } from '@/lib/stores/types';

const useEventStore = create<ListStore<EventDto, FindEventsParams>>(
  (set, get) =>
    createListStoreActions({
      set,
      get,
      fetchApi: getEvents,
      initialData: {
        params: {
          apartmentId: '',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      },
    })
);

export default useEventStore;
