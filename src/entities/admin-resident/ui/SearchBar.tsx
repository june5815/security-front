import Image from 'next/image';
import Input from '@/shared/Input';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value || '');

  // value prop이 외부에서 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue]);

  return (
    <div>
      <label className='mb-3 block text-[14px] font-semibold'>검색</label>
      <Input
        color='search'
        placeholder='검색어를 입력해 주세요'
        childrenPosition='left'
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      >
        <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
      </Input>
    </div>
  );
}
