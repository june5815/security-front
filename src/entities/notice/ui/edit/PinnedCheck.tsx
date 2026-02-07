import NoticeCheck from '@/entities/notice/ui/NoticeCheck';
import { NoticeDetailDto, NoticeUpdateRequest } from '@/lib/types';

interface Props {
  notice: NoticeDetailDto;
  handleNotice: ({
    field,
    value,
  }: {
    field: keyof NoticeUpdateRequest;
    value: NoticeUpdateRequest[keyof NoticeUpdateRequest];
  }) => void;
}

export default function PinnedCheck({ notice, handleNotice }: Props) {
  return (
    <NoticeCheck
      title='중요글로 상단에 공지'
      notice={notice}
      field='isPinned'
      handleNotice={handleNotice}
    />
  );
}
