import { useEffect, useState } from 'react';

import EditAdminNoticeOptions from '@/entities/notice/ui/edit/EditAdminNoticeOptions';
import NoticeMain from '@/entities/notice/ui/NoticeMain';
import useAuthStore from '@/lib/stores/useAuthStore';
import { useRouter } from 'next/router';
import useNoticeDetailStore from '@/lib/stores/useNoticeDetailStore';
import { NoticeUpdateRequest } from '@/lib/types';
import { updateNotice } from '@/lib/api/notices';

export default function EditAdminNoticePage() {
  const { data, updateParams, update } = useNoticeDetailStore();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const authentication = useAuthStore((state) => state.authentication);
  const router = useRouter();
  const { id } = router.query;
  const isCalendarCheck = !!data?.event;

  useEffect(() => {
    if (id && typeof id === 'string') {
      updateParams({id});
    }
  }, [id]);

  const handleEditNotice = ({
    field,
    value,
  }: {
    field: keyof NoticeUpdateRequest;
    value: NoticeUpdateRequest[keyof NoticeUpdateRequest];
  }) => {
    update({
      [field]: value,
    });
  };

  // newNotice 가공
  const handleEditSubmit = async () => {
    if (!data || !authentication) return;

    const newNotice: NoticeUpdateRequest = {
      category: data.category,
      title: data.title,
      content: data.content,
      isPinned: data.isPinned || false,
      event: data.event
    };

    try {
      await updateNotice(id as string, newNotice);
      router.push('/admin/notice');
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
    }
  };

  if (!id) return <p>Loading...</p>;
  if (!data) return <p>공지사항 데이터가 없습니다.</p>;

  return (
    <>
      <h1 className='mb-[54px] text-[26px] font-bold'>공지사항 수정</h1>
      <EditAdminNoticeOptions
        data={data}
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        handleEditNotice={handleEditNotice}
        isCalendarCheck={isCalendarCheck}
      />
      <NoticeMain
        notice={data}
        handleNotice={handleEditNotice}
        handleSubmit={handleEditSubmit}
        text='공지사항 수정하기'
      />
    </>
  );
}
