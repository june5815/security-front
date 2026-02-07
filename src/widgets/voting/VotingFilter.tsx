import Select from '@/shared/Select';
import Input from '@/shared/Input';
import Button from '@/shared/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PollStatus } from '@/lib/types';
import { useBuildingAndUnitOptions } from '@/shared/hooks/useBuildingAndUnitOptions';
import { useEffect, useState } from 'react';


interface Props {
  building?: number;
  status?: PollStatus;
  searchKeyword?: string;
  onChangeBuilding: (dong?: number) => void;
  onChangeStatus: (status?: PollStatus) => void;
  onSearchKeyword: (keyword?: string) => void;
}

export default function VotingFilter({ building, status, searchKeyword, onSearchKeyword, onChangeStatus, onChangeBuilding }: Props) {
  const router = useRouter();
  const isAdminPage = router.pathname === '/admin/voting';
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');

  const { buildingOptions} = useBuildingAndUnitOptions();

  // searchKeyword prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalSearchKeyword(searchKeyword || '');
  }, [searchKeyword]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchKeyword !== searchKeyword) {
        onSearchKeyword(localSearchKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchKeyword]);

  const handleDongChange = (val: string) => {
    if (val === 'all') {
      onChangeBuilding();
    } else {
      onChangeBuilding(Number(val));
    }
  };

  const handleStatusChange = (val: PollStatus | 'ALL') => {
    if (val == 'ALL') {
      onChangeStatus();
    } else {
      onChangeStatus(val);
    }
  };


  return (
    <ul className='flex flex-col gap-[25px]'>
      <li className='mt-10 flex gap-4'>
        <div>
          <Select
            showPlaceholder={true}
            placeholder='전체'
            label='투표권자'
            options={buildingOptions}
            value={String(building || 'all')}
            onChange={handleDongChange}
          />
        </div>
        <div>
          <Select
            showPlaceholder={true}
            placeholder='전체'
            label='투표 상태'
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'PENDING', label: '투표전' },
              { value: 'IN_PROGRESS', label: '투표중' },
              { value: 'CLOSED', label: '마감' },
            ]}
            value={status}
            onChange={e => handleStatusChange(e as PollStatus | 'ALL')}
          />
        </div>
      </li>
      <li>
        <div className='flex items-center justify-between'>
          <div className='w-[375px]'>
            <Input
              label='검색'
              childrenPosition='left'
              color='search'
              placeholder='검색어를 입력해 주세요'
              value={localSearchKeyword}
              onChange={(e) => setLocalSearchKeyword(e.target.value)}
            >
              <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
            </Input>
          </div>
          {isAdminPage && (
            <Link href='/admin/voting/create'>
              <Button color='primary' outline={true} label='&nbsp;'>
                주민투표 등록
              </Button>
            </Link>
          )}
        </div>
      </li>
    </ul>
  );
}
