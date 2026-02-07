import { useEffect } from 'react';
import { useRouter } from 'next/router';
import VotingDetailTitle from './VotingDetailTitle';
import VotingDetailContent from './VotingDetailContent';
import usePollDetailStore from '@/lib/stores/usePollDetailStore';

export default function VotingDetailPage() {
  const { id } = useRouter().query;

  const { updateParams, data, loading } = usePollDetailStore();

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    updateParams({id});
  }, [id]);

  if (loading) return <div>불러오는 중입니다...</div>;
  if (!data) return <div>존재하지 않는 투표입니다.</div>;

  return (
    <div>
      <VotingDetailTitle data={data} />
      <VotingDetailContent data={data}  />
    </div>
  );
}
