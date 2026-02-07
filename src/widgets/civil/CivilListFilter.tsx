import Select from '@/shared/Select';
import Input from '@/shared/Input';
import Image from 'next/image';
import Button from '@/shared/Button';
import Link from 'next/link';
import { ComplaintStatus } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

type Option = { value: string; label: string };

type Props = {
  status?: ComplaintStatus;
  keyword?: string;
  onStatusChange: (value?: ComplaintStatus) => void;
  onKeywordChange: (value?: string) => void;
};

type AdminProps = Props & {
  visibility?: boolean;
  building?: number;
  unit?: number;
  buildingOptions: Option[];
  unitOptions: Option[];
  onVisibilityChange: (value?: boolean) => void;
  onBuildingChange: (value?: number) => void;
  onUnitChange: (value?: number) => void;
};

export const statusOptions = [
  { value: 'PENDING', label: '접수전' },
  { value: 'IN_PROGRESS', label: '처리중' },
  { value: 'RESOLVED', label: '처리완료' },
  { value: 'REJECTED', label: '처리불가' },
];

const filterStatusOptions = [{ value: 'all', label: '전체' }, ...statusOptions];

export function AdminCivilListFilter({
  status,
  keyword,
  onStatusChange,
  onKeywordChange,
  visibility,
  building,
  unit,
  buildingOptions,
  unitOptions,
  onVisibilityChange,
  onBuildingChange,
  onUnitChange,
}: AdminProps) {
  const [localKeyword, setLocalKeyword] = useState(keyword || '');

  // keyword prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalKeyword(keyword || '');
  }, [keyword]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== keyword) {
        onKeywordChange(localKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localKeyword]);

  const onChangeBuildingOptions = useCallback((value: string) => {
    if (value == 'all') {
      onBuildingChange();
    } else {
      onBuildingChange(Number(value));
    }
  }, [onBuildingChange]);


  const onChangeUnitOptions = useCallback((value: string) => {
    if (value == 'all') {
      onUnitChange();
    } else {
      onUnitChange(Number(value));
    }
  }, [onUnitChange]);

  const onChangeVisibilityOptions = useCallback((value: string) => {
    if (value == 'all') {
      onVisibilityChange();
    } else {
      onVisibilityChange(Boolean(value));
    }
  }, [onVisibilityChange]);

  const onChangeStatusOptions = useCallback((value: string) => {
    if (value == 'all') {
      onStatusChange();
    } else {
      onStatusChange(value as ComplaintStatus);
    }
  }, [onStatusChange]);

  return (
    <ul className='flex flex-col gap-[25px]'>
      <li>
        <ul className='flex gap-4'>
          <li>
            <Select label='동' value={String(building || 'all')} onChange={onChangeBuildingOptions} options={buildingOptions} />
          </li>
          <li>
            <Select label='호' value={String(unit || 'all')} onChange={onChangeUnitOptions} options={unitOptions} />
          </li>
          <li>
            <Select
              label='공개 여부'
              value={visibility == undefined ? 'all' : String(visibility)}
              onChange={onChangeVisibilityOptions}
              options={[
                { value: 'all', label: '전체' },
                { value: 'true', label: '공개' },
                { value: 'false', label: '비공개' },
              ]}
            />
          </li>
          <li>
            <Select
              label='처리 상태'
              value={status}
              onChange={onChangeStatusOptions}
              options={filterStatusOptions}
            />
          </li>
        </ul>
      </li>
      <li>
        <div className='w-[375px]'>
          <Input
            label='검색'
            childrenPosition='left'
            color='search'
            placeholder='검색어를 입력해 주세요'
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
          >
            <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
          </Input>
        </div>
      </li>
    </ul>
  );
}

export function ResidentCivilListFilter({
  status,
  keyword,
  onStatusChange,
  onKeywordChange,
}: Props) {
  const [localKeyword, setLocalKeyword] = useState(keyword || '');

  // keyword prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalKeyword(keyword || '');
  }, [keyword]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== keyword) {
        onKeywordChange(localKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localKeyword]);

  const onChangeStatusOptions = useCallback((value: string) => {
    if (value == 'all') {
      onStatusChange();
    } else {
      onStatusChange(value as ComplaintStatus);
    }
  }, [onStatusChange]);

  return (
    <ul className='mb-5 flex flex-col gap-[25px]'>
      <li>
        <ul className='flex gap-4'>
          <li>
            <Select
              label='처리 상태'
              value={status}
              onChange={onChangeStatusOptions}
              options={filterStatusOptions}
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
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
            >
              <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
            </Input>
          </div>
          <Link href='/resident/civil/create'>
            <Button label='&nbsp;'>민원 등록하기</Button>
          </Link>
        </div>
      </li>
    </ul>
  );
}
