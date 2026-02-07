import { useState, useEffect } from 'react';
import Select from '@/shared/Select';
import Input from '@/shared/Input';
import Image from 'next/image';
import Button from '@/shared/Button';
import { JoinStatus } from '@/lib/types';
import { useBuildingAndUnitOptions } from '@/shared/hooks/useBuildingAndUnitOptions';
import { deleteRejectedResidentUsers, updateResidentUsersBatchJoinStatus } from '@/lib/api/users';

interface Props {
  building?: number;
  unit?: number;
  joinStatus?: JoinStatus;
  searchKeyword?: string;
  onBuildingChange: (val?: number) => void;
  onUnitNumberChange: (val?: number) => void;
  onJoinStatusChange: (val?: JoinStatus) => void;
  onSearchKeywordChange: (val?: string) => void;
}

export default function ResidentInfoFilter({
  building,
  unit,
  joinStatus,
  searchKeyword,
  onBuildingChange,
  onUnitNumberChange,
  onJoinStatusChange,
  onSearchKeywordChange,
}: Props) {
  const [inputValue, setInputValue] = useState(searchKeyword || '');
  const { buildingOptions, unitOptions } = useBuildingAndUnitOptions();

  // searchKeyword prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setInputValue(searchKeyword || '');
  }, [searchKeyword]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchKeyword) {
        onSearchKeywordChange(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleApproveAll = async () => {
    try {
      await updateResidentUsersBatchJoinStatus({joinStatus: 'APPROVED'})
      alert('전체 승인 완료');
      location.reload();
    } catch {
      alert('전체 승인 실패');
    }
  };

  const handleRejectAll = async () => {
    try {
      await updateResidentUsersBatchJoinStatus({joinStatus: 'REJECTED'});
      alert('전체 거절 완료');
      location.reload();
    } catch {
      alert('전체 거절 실패');
    }
  };

  const handleCleanupRejectedUsers = async () => {
    try {
      await deleteRejectedResidentUsers();
      alert('거절 계정 정리가 완료되었습니다.');
      location.reload();
    } catch (err) {
      alert('거절 계정 정리 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <ul className='flex flex-col gap-[25px]'>
      <li>
        <ul className='flex gap-4'>
          <li>
            <Select
              label='동'
              value={String(building || 'all')}
              onChange={(v) => {
                if (v == 'all') {
                  onBuildingChange();
                } else {
                  onBuildingChange(Number(v))
                }
              }}
              options={buildingOptions}
            />
          </li>
          <li>
            <Select
              label='호'
              value={String(unit || 'all')}
              onChange={(v) => {
                if (v == 'all') {
                  onUnitNumberChange();
                } else {
                  onUnitNumberChange(Number(v))
                }
              }}
              options={unitOptions}
            />
          </li>
          <li>
            <Select
              label='승인 상태'
              value={joinStatus || 'all'}
              onChange={(v) => {
                if (v == 'all') {
                  onJoinStatusChange();
                } else {
                  onJoinStatusChange(v as JoinStatus)
                }
              }}
              options={[
                { value: 'all', label: '전체' },
                { value: 'PENDING', label: '대기' },
                { value: 'APPROVED', label: '승인' },
                { value: 'REJECTED', label: '거절' },
              ]}
            />
          </li>
        </ul>
      </li>
      <li>
        <div className='flex items-center justify-between'>
          <div className='w-[375px]'>
            <Input
              label='검색'
              color='search'
              placeholder='검색어를 입력해 주세요'
              childrenPosition='left'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            >
              <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
            </Input>
          </div>
          <ul className='flex items-center gap-4'>
            <li>
              <Button label='&nbsp;' onClick={handleApproveAll}>
                대기 중인 계정 전체 승인
              </Button>
            </li>
            <li>
              <Button outline={true} label='&nbsp;' onClick={handleRejectAll}>
                대기 중인 계정 전체 거절
              </Button>
            </li>
            <li>
              <Button
                color='secondary'
                outline={true}
                label='&nbsp;'
                onClick={handleCleanupRejectedUsers}
              >
                거절 계정 관리
              </Button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  );
}
