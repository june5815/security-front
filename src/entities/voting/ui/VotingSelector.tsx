import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '@/shared/Button';
import useAuthStore from '@/lib/stores/useAuthStore';
import { cancelVote, vote } from '@/lib/api/polls';
import usePollDetailStore from '@/lib/stores/usePollDetailStore';

interface Option {
  id: string;
  title: string;
  voteCount: number;
}

interface VotingSelectorProps {
  pollId: string;
  options: Option[];
  endAt: string;
  buildingPermission: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
  optionIdVotedByMe?: string | null;
}

export default function VotingSelector({
  pollId,
  options,
  endAt,
  buildingPermission,
  status, optionIdVotedByMe
}: VotingSelectorProps) {
  const router = useRouter();
  const { update: updateData } = usePollDetailStore();

  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const { resident, role } = useAuthStore.getState().authentication || {};

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(optionIdVotedByMe || null);
  const [hasVoted, setHasVoted] = useState(Boolean(optionIdVotedByMe !== undefined));

  const permission = buildingPermission;
  const buliding = Number(resident?.building);
  const canVote = role !== 'USER' ? true : buildingPermission === 0 || permission === buliding;

  const endDate = new Date(endAt);
  const isUnavailable = status !== 'IN_PROGRESS';

  const formattedEndAt = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
  const isAdminPage = router.pathname === '/admin/voting/detail/[id]';

  const handleSubmitVote = async () => {
    // 예외 처리
    if (!selectedOptionId || isUnavailable || !canVote || submitting) return;

    setSubmitting(true);
    try {
      await vote(pollId, selectedOptionId);
      setHasVoted(true); // 투표 완료 상태
      updateData({
        optionIdVotedByMe: selectedOptionId,
        options: options.map(opt => {
          if (opt.id === selectedOptionId) {
            opt.voteCount +=1
          }
          return opt;
        })
      })

      alert(`투표 완료`);
    } catch (error) {
      console.error('투표 실패:', error);
      alert('투표에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelVote = async () => {
    if (!hasVoted || isUnavailable || canceling) return;

    const prevOptionId = optionIdVotedByMe;
    // 쿠키에 없는 기존 값이 없는 경우 예외 처리
    if (!prevOptionId) {
      setHasVoted(false);
      setSelectedOptionId(null);
      return;
    }

    setCanceling(true);
    try {
      await cancelVote(pollId, prevOptionId);
      updateData({
        optionIdVotedByMe: undefined,
        options: options.map(opt => {
          if (opt.id === selectedOptionId) {
            opt.voteCount -=1
          }
          return opt;
        })
      })

      setHasVoted(false);
      setSelectedOptionId(null);

      alert('투표가 취소되었습니다.');
    } catch (error) {
      console.error('투표 취소 실패:', error);
      alert('투표 취소에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCanceling(false);
    }
  };

  // 투표 버튼 라벨 및 disabled 상태 계산
  const voteButtonLable = (() => {
    if (!canVote) return '투표 권한이 없습니다';
    if (isUnavailable) return '투표 기간이 아닙니다';
    if (submitting) return '처리 중';

    return '제출하기';
  })();

  const checkedButtonDisabled =
    selectedOptionId === null || submitting || isUnavailable || hasVoted || !canVote;


  return (
    <div className='mt-[30px] w-[435px] rounded-[12px] border border-gray-200 p-[30px]'>
      <div className='flex items-center justify-between'>
        <h1 className='text-[18px] font-bold'>투표하기</h1>
        <span className='text-[14px] text-gray-500'>투표 마감일 {formattedEndAt}까지</span>
      </div>

      <ul className='mt-[10px] flex flex-col gap-[10px]'>
        {options.map((option) => (
          <li
            key={option.id}
            className={`flex cursor-pointer items-center justify-between gap-[8px] rounded-[12px] border px-[20px] py-[12.5px] font-medium ${
              selectedOptionId === option.id
                ? 'bg-main text-white'
                : 'hover:border-main border-gray-200 text-gray-500'
            }`}
            onClick={() => {
              if (hasVoted) return;
              setSelectedOptionId((prev) => (prev === option.id ? null : option.id));
            }}
          >
            <p className='text-[16px]'>{option.title}</p>
            {isAdminPage && (
              <span
                className={`text-[14px] ${
                  selectedOptionId === option.id
                    ? 'bg-main text-white'
                    : 'hover:border-main border-gray-200 text-gray-300'
                }`}
              >
                {option.voteCount}표
              </span>
            )}
          </li>
        ))}
      </ul>

      <Button
        fill={true}
        className='mt-[10px]'
        disabled={checkedButtonDisabled}
        onClick={handleSubmitVote}
      >
        {voteButtonLable}
      </Button>

      {status === 'IN_PROGRESS' && hasVoted && (
        <Button
          className='mt-[10px]'
          fill={true}
          color='secondary'
          disabled={canceling}
          onClick={handleCancelVote}
        >
          {canceling ? '취소 중' : '투표 취소'}
        </Button>
      )}
    </div>
  );
}
