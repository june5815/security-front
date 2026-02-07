import { Dispatch, SetStateAction } from 'react';

import { EditNoticeParam } from '@/entities/notice/model/notice.types';

export interface CalendarCell {
  day: number;
  date: Date;
  muted?: boolean;
}

export interface PopupCalendarProps {
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
  handleCalenderOpen: () => void;
  handleNotice: (params: EditNoticeParam) => void;
}