import { useRouter } from 'next/router';
import Title from '@/shared/Title';
import CivilMeta from './CivilMeta';
import CivilContent from './CivilContent';
import Select from '@/shared/Select';
import { useEffect } from 'react';
import CommentSection from '@/shared/comments/ui/CommentSection';
import useAuthStore from '@/lib/stores/useAuthStore';
import useComplaintDetailStore from '@/lib/stores/useComplaintDetailStore';
import useCommentStore from '@/lib/stores/useCommentStore';
import { ComplaintStatusUpdateRequest } from '@/lib/types';
import { updateComplaintStatus } from '@/lib/api/complaints';

export default function CivilViewPage() {
  const { pathname } = useRouter();
  const isAdmin = pathname.includes('/admin');
  const router = useRouter();
  const { id } = router.query;
  const authentication = useAuthStore((state) => state.authentication);

  const { data: complaint, updateParams, update: updateData } = useComplaintDetailStore();
  const { updateParams: updateCommentParams } = useCommentStore();

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    updateParams({id});
    updateCommentParams({resourceId: id, resourceType: 'COMPLAINT'});
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || typeof id !== 'string' || !complaint) return;

    const currentLabel = {
      PENDING: '접수전',
      IN_PROGRESS: '처리중',
      RESOLVED: '처리완료',
      REJECTED: '처리불가',
    }[complaint.status];

    const newLabel = {
      PENDING: '접수전',
      IN_PROGRESS: '처리중',
      RESOLVED: '처리완료',
    }[newStatus];

    const confirmed = window.confirm(
      `상태를 "${currentLabel}"에서 "${newLabel}"(으)로 변경하시겠습니까?`,
    );
    if (!confirmed) return;

    try {
      const request: ComplaintStatusUpdateRequest = {
        status: newStatus as  'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
      }
      await updateComplaintStatus(id, request);
      updateData(request);

      window.alert(`상태가 "${currentLabel}"에서 "${newLabel}"(으)로 변경되었습니다.`);
    } catch (err) {
      console.error('상태 변경 실패:', err);
      window.alert('상태 변경에 실패했습니다.');
    }
  };

  if (!complaint) {
    return <div className='py-[100px] text-center text-gray-500'>불러오는 중...</div>;
  }

  return (
    <div className='text-gray-900'>
      <div>
        <Title>{complaint.title}</Title>
        <CivilMeta
          date={complaint.createdAt}
          views={complaint.viewsCount}
          commentsCount={complaint.commentCount}
          writerId={complaint.complainant.id}
          userId={authentication?.id as string}
          complaintId={id as string}
          isAdmin={isAdmin}
          status={complaint.status}
        />
      </div>

      <CivilContent content={complaint.content} />

      {isAdmin && (
        <div className='mb-5'>
          <Select
            options={[
              { value: 'PENDING', label: '접수전' },
              { value: 'IN_PROGRESS', label: '처리중' },
              { value: 'RESOLVED', label: '처리완료' },
            ]}
            defaultValue={complaint.status}
            small={true}
            onChange={handleStatusChange}
          />
        </div>
      )}

      <CommentSection />
    </div>
  );
}
