import { Dispatch, SetStateAction } from 'react';

import CalendarRegisterCheck from './CalendarRegisterCheck';
import CategorySelect from './CategorySelect';
import NoticeCalendarOpen from '@/entities/notice/ui/NoticeCalendarOpen';
import PinnedCheck from './PinnedCheck';
import { NoticeDetailDto, NoticeUpdateRequest } from '@/lib/types';

interface Props {
  data: NoticeDetailDto;
  calendarOpen: boolean;
  setCalendarOpen: Dispatch<SetStateAction<boolean>>;
  isCalendarCheck: boolean;
  handleEditNotice: ({
    field,
    value,
  }: {
    field: keyof NoticeUpdateRequest;
    value: NoticeUpdateRequest[keyof NoticeUpdateRequest];
  }) => void;
}

export default function EditAdminNoticeOptions({
  data,
  calendarOpen,
  setCalendarOpen,
  handleEditNotice,
  isCalendarCheck,
}: Props) {
  return (
    <div className='mb-8 flex gap-10'>
      <CategorySelect
        category={data.category}
        onChange={(value) => handleEditNotice({ field: 'category', value })}
      />
      <PinnedCheck notice={data} handleNotice={handleEditNotice} />
      <CalendarRegisterCheck
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        isChecked={isCalendarCheck}
      />
      <NoticeCalendarOpen
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        handleNotice={handleEditNotice}
      />
    </div>
  );
}
