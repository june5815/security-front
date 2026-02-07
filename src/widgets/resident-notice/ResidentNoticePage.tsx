import Image from 'next/image';
import Input from '@/shared/Input';
import Select from '@/shared/Select';
import ResidentNoticeTable from '@/entities/notice/ui/ResidentNoticeTable';
import useNoticeStore from '@/lib/stores/useNoticeStore';
import { NoticeCategory } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ResidentNoticePage() {
  const { updateParams, params } = useNoticeStore();
  const { searchKeyword } = params;
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');

  // searchKeyword prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalSearchKeyword(searchKeyword || '');
  }, [searchKeyword]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchKeyword !== searchKeyword) {
        updateParams({ searchKeyword: localSearchKeyword });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchKeyword]);

  const SELECT_OPTIONS = [
    { value: 'all', label: '전체' },
    { value: 'MAINTENANCE', label: '정기점검' },
    { value: 'EMERGENCY', label: '긴급점검' },
    { value: 'COMMUNITY', label: '공동생활' },
    { value: 'RESIDENT_VOTE', label: '주민투표' },
    { value: 'RESIDENT_COUNCIL', label: '주민회의' },
    { value: 'ETC', label: '기타' },
  ];

  const handleSelectChange = (value: string) => {
    if (value === 'all') {
      updateParams({category: undefined});
    } else {
      updateParams({category: value as NoticeCategory});
    }
  }

  return (
    <>
      <h1 className='mb-10 text-[26px] font-bold'>공지사항</h1>

      <div className='mb-5'>
        <Select
          label='분류'
          options={SELECT_OPTIONS}
          onChange={handleSelectChange}
        />
      </div>

      <div className='flex items-end justify-between'>
        <div className='w-[375px]'>
          <Input
            color='search'
            label='검색'
            placeholder='검색어를 입력해 주세요'
            childrenPosition='left'
            value={localSearchKeyword}
            onChange={(e) => setLocalSearchKeyword(e.target.value)}
          >
            <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
          </Input>
        </div>
      </div>

      {/* 필터 상태 전달 */}
      <ResidentNoticeTable />
    </>
  );
}
