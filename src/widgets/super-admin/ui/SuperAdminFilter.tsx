import { useEffect, useState } from 'react';
import Select from '@/shared/Select';
import Input from '@/shared/Input';
import Button from '@/shared/Button';
import Image from 'next/image';
import { deleteRejectedAdminUsers, updateAdminUsersBatchJoinStatus } from '@/lib/api/users';
import useAdminUserStore from '@/lib/stores/useAdminUserStore';
import { JoinStatus } from '@/lib/types';


export default function SuperAdminFilter() {
  const { params, updateParams } = useAdminUserStore();
  const { searchKeyword, joinStatus } = params;
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ searchKeyword: localSearchKeyword });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchKeyword, updateParams]);

  const handleApproveAll = async () => {
    try {
      await updateAdminUsersBatchJoinStatus({joinStatus: 'APPROVED'})
      alert('전체 승인 완료');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('전체 승인 실패');
    }
  };

  const handleRejectAll = async () => {
    try {
      await updateAdminUsersBatchJoinStatus({joinStatus: 'REJECTED'})
      alert('전체 거절 완료');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('전체 거절 실패');
    }
  };

const handleRejectCleanup = async () => {
    try {
      const response = await deleteRejectedAdminUsers();

      if (response.status === 202) {
        const message = response.data?.message || "현재 삭제 작업이 진행 중입니다.";
        alert(message);
      } else {
        alert('거절 계정 정리가 완료되었습니다.');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('거절 계정 정리 실패');
    }
  };

  return (
    <ul className='flex flex-col gap-[25px]'>
      <li>
        <Select
          label='승인 상태'
          className='cursor-pointer'
          value={joinStatus}
          onChange={(value) => {
            const _joinStatus: JoinStatus | undefined = value === 'all' ? undefined : value as JoinStatus;
            updateParams({joinStatus: _joinStatus})
          }}
          options={[
            { value: 'all', label: '전체' },
            { value: 'APPROVED', label: '승인' },
            { value: 'REJECTED', label: '거절' },
            { value: 'PENDING', label: '대기' },
          ]}
        />
      </li>
      <li>
        <div className='flex items-center justify-between'>
          <div className='w-[375px]'>
            <Input
              label='검색'
              value={localSearchKeyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalSearchKeyword(e.target.value)
              }
              childrenPosition='left'
              color='search'
              placeholder='검색어를 입력해 주세요'
            >
              <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
            </Input>
          </div>
          <div className='flex items-center gap-[16px]'>
            <Button
              onClick={handleApproveAll}
              outline
              label='&nbsp;'
              className='hover:bg-main hover:text-white'
            >
              대기 중인 계정 전체 승인
            </Button>
            <Button
              onClick={handleRejectAll}
              outline
              label='&nbsp;'
              className='hover:bg-main hover:text-white'
            >
              대기 중인 계정 전체 거절
            </Button>
            <Button color='secondary' outline label='&nbsp;' onClick={handleRejectCleanup}>
              거절 계정 정리
            </Button>
          </div>
        </div>
      </li>
    </ul>
  );
}
