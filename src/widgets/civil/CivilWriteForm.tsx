import { useRouter } from 'next/router';
import Input from '@/shared/Input';
import Textarea from '@/shared/Textarea';
import Button from '@/shared/Button';
import Select from '@/shared/Select';
import { useEffect, useState } from 'react';
import useComplaintDetailStore from '@/lib/stores/useComplaintDetailStore';
import { createComplaint, updateComplaint } from '@/lib/api/complaints';
import { ComplaintsCreateRequest, ComplaintsUpdateRequest } from '@/lib/types';
import { useApartmentId } from '@/shared/hooks/useApartmentId';

type Props = {
  isEdit?: boolean;
};

export default function CivilWriteForm({ isEdit = false }: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const {apartmentId} = useApartmentId();

  const { updateParams, update: updateData } = useComplaintDetailStore();

  useEffect(() => {
    if (isEdit && id && typeof id === 'string') {
      updateParams({id});
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && id && typeof id === 'string') {
        const request: ComplaintsUpdateRequest = {
          title,
          content,
          isPublic
        }
        await updateComplaint(id, request);
        updateData(request);
        alert('민원이 수정되었습니다.');
      } else {
        if (!apartmentId) {
          throw new Error('아파트 정보를 알 수 없습니다.');
        }
        const request: ComplaintsCreateRequest = {
          title,
          content,
          isPublic,
          apartmentId
        }
        await createComplaint(request);
        alert('민원이 등록되었습니다.');
      }
      router.push('/resident/civil');
    } catch (error) {
      console.error('민원 등록/수정 실패', error);
      alert('요청에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul className='flex flex-col gap-8'>
        <li className='flex'>
          <p className='w-[45px] text-[14px] leading-[36px]'>공개</p>
          <div className='flex-1'>
            <Select
              options={[
                { value: 'public', label: '공개' },
                { value: 'private', label: '비공개' },
              ]}
              small={true}
              onChange={(val) => setIsPublic(val === 'public')}
              defaultValue={isPublic ? 'public' : 'private'}
            />
          </div>
        </li>
        <li className='flex'>
          <p className='w-[45px] text-[14px] leading-[48px]'>제목</p>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='제목을 입력해주세요'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </li>
        <li className='flex'>
          <p className='w-[45px] text-[14px] leading-[48px]'>내용</p>
          <div className='flex-1'>
            <Textarea
              className='h-[570px]'
              placeholder='내용을 입력해주세요'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </li>
        <li className='flex'>
          <p className='w-[45px] text-[14px] leading-[48px]'></p>
          <div className='flex-1'>
            <Button size='lg' className='w-[480px]' type='submit'>
              {isEdit ? '민원 수정하기' : '민원 등록하기'}
            </Button>
          </div>
        </li>
      </ul>
    </form>
  );
}
