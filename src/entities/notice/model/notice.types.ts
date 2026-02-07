import { Dispatch, SetStateAction } from 'react';
import { NoticeDetailDto, NoticeDto, NoticeUpdateRequest } from '@/lib/types';

export interface NoticeSelectProps {
  label: string;
  defaultOption?: string;
  handleNotice: (params: EditNoticeParam) => void;
}

export interface NoticeCalendarOpenProps {
  calendarOpen: boolean;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleNotice: (params: EditNoticeParam) => void;
}

export interface NoticeCheckProps {
  title: string;
  field?: 'isPinned';
  notice?: Partial<NoticeDto> | null;
  setNotice?: Dispatch<SetStateAction<NoticeDetailDto>>;
  handleNotice: (params: EditNoticeParam) => void;
}

export interface EditNoticeParam {
  field: keyof NoticeUpdateRequest;
  value: NoticeUpdateRequest[keyof NoticeUpdateRequest];
}

export interface NoticeMainProps {
  notice?: NoticeDetailDto;
  handleNotice: (params: EditNoticeParam) => void;
  handleSubmit: () => void;
  isDisabled?: boolean;
  text: string;
}

// 제네릭 컬럼 타입
export interface Column<T> {
  title: string;
  key: keyof T;
  width: string | number;
}

export interface AdminTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  editClick: (row: NoticeDto) => void;
  deleteClick: (row: NoticeDto) => void;
}
