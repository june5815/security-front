import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CommentSection from '@/shared/comments/ui/CommentSection';
import useNoticeDetailStore from '@/lib/stores/useNoticeDetailStore';
import useCommentStore from '@/lib/stores/useCommentStore';

const CATEGORY_LABEL_MAP = {
  MAINTENANCE: '정기점검',
  EMERGENCY: '긴급점검',
  COMMUNITY: '공동생활',
  RESIDENT_VOTE: '주민투표',
  RESIDENT_COUNCIL: '주민회의',
  ETC: '기타',
} as const;

export default function DetailResidentNoticePage() {
  const router = useRouter();
  const { id: noticeId } = router.query;

  const { data: notice, updateParams, loading } = useNoticeDetailStore();
  const { updateParams: updateCommentParam } = useCommentStore();

  useEffect(() => {
    if (!noticeId || typeof noticeId !== 'string') return;
    updateParams({id: noticeId});
    updateCommentParam({resourceType: 'NOTICE', resourceId: noticeId});
  }, [noticeId]);

  if (loading) {
    return <div className='py-[100px] text-center text-gray-500'>불러오는 중...</div>;
  }
  if (!notice) {
    return null;
  }

  return (
    <div className='text-gray-900'>
      <div className='border-b border-gray-200'>
        <div className='mb-5 text-sm text-gray-500'>공지사항</div>
        <h2 className='text-[26px] font-bold'>{notice.title}</h2>
        <div className='flex justify-between pt-8 pb-4.5'>
          <ul className='flex gap-4 text-[14px] text-gray-400'>
            <li className='text-main'>
              {CATEGORY_LABEL_MAP[notice.category as keyof typeof CATEGORY_LABEL_MAP]}
            </li>
            <li className='text-gray-200'>|</li>
            <li className='text-gray-500'>{notice.createdAt}</li>
            <li className='text-gray-200'>|</li>
            <li>조회수&nbsp;&nbsp;{notice.viewsCount}</li>
            <li className='text-gray-200'>|</li>
            <li>댓글수&nbsp;&nbsp;{notice.commentCount}</li>
          </ul>
        </div>
      </div>

      <div className='mt-[40px] mb-[90px] text-lg leading-relaxed whitespace-pre-wrap'>
        {notice.content}
      </div>
      <CommentSection />
    </div>
  );
}
