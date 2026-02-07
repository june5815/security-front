import { useEffect } from 'react';
import { useRouter } from 'next/router';
import VotingFormPage from '@/widgets/voting/VotingFormPage';
import { addLayout } from '@/shared/lib/addLayout';
import usePollDetailStore from '@/lib/stores/usePollDetailStore';

export default function VotingEdit() {
  const { id } = useRouter().query;
  const { updateParams, data, loading } = usePollDetailStore();

  useEffect(() => {
    if (!id) return;
    updateParams({id: id as string})
  }, [id]);

  if (loading) return <div className='text-xl'>로딩 중...</div>;

  if (!data) return <div className='text-3xl'>존재하지 않는 투표입니다.</div>;

  return <VotingFormPage isEdit initialData={data} />;
}

VotingEdit.getLayout = addLayout('admin');
