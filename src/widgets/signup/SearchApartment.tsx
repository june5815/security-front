import Input from '@/shared/Input';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ApartmentsDto } from '@/lib/types';

interface SearchApartmentProps {
  searchKeyword?: string;
  onChangeSearchKeyword: (searchKeyword: string) => void;
  selectedApartment?: ApartmentsDto;
  onSelect: (apartment?: ApartmentsDto) => void;
  apartmentList: ApartmentsDto[];
  errorText?: string;
  id?: string;
  placeholder?: string;
}

export default function SearchApartment({
  searchKeyword,
  onChangeSearchKeyword,
  selectedApartment,
  onSelect,
  apartmentList,
  errorText,
  id = 'apartmentName',
  placeholder = '입주 아파트명을 입력해주세요',
}: SearchApartmentProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if ((searchKeyword ?? '').trim() === '') {
      setShowDropdown(false);
      return;
    }

    setShowDropdown(apartmentList.length > 0);
  }, [searchKeyword, apartmentList]);

  const handleSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword =  e.target.value;
    onSelect(undefined);
    onChangeSearchKeyword(keyword)
  }

  return (
    <div className='relative'>
      <Input
        id={id}
        placeholder={placeholder}
        value={selectedApartment ? selectedApartment.name : searchKeyword}
        onChange={handleSearchKeywordChange}
        errorText={errorText}
        color={errorText ? 'error' : 'secondary'}
        childrenPosition='right'
      >
        <Image src='/icon_search.svg' alt='검색 아이콘' width={24} height={24} />
      </Input>
      {showDropdown && (
        <ul className='absolute z-10 mt-2 w-full rounded-[12px] border border-gray-200 bg-white py-2 text-sm'>
          {apartmentList.map((item) => (
            <li
              key={item.id}
              className='hover:bg-main-15 cursor-pointer px-4 py-2'
              onClick={() => {
                onSelect(item);
                setTimeout(() => {
                  setShowDropdown(false);
                }, 0);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
