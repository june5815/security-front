import Checkbox from '@/shared/Checkbox';
import Input from '@/shared/Input';
import Select from '@/shared/Select';
import VotingFormDate from './VotingFormDate';
import VotingFormItem from './VotingFormItem';
import Textarea from '@/shared/Textarea';
import Button from '@/shared/Button';
import Title from '@/shared/Title';
import useAuthStore from '@/lib/stores/useAuthStore';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { votingFormSchema } from '@/entities/voting/schema/voting.schema';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { useApartmentId } from '@/shared/hooks/useApartmentId';
import { useBuildingAndUnitOptions } from '@/shared/hooks/useBuildingAndUnitOptions';
import { PollCreateRequest, PollDetailDto, PollUpdateRequest } from '@/lib/types';
import { createPoll, updatePoll } from '@/lib/api/polls';

const titleStyle = 'w-[50px] text-[14px] font-semibold mr-[30px]';

interface Props {
  isEdit?: boolean;
  initialData?: PollDetailDto;
}

type VotingFormType = z.infer<typeof votingFormSchema>;

export default function VotingFormPage({ isEdit = false, initialData }: Props) {
  const userId = useAuthStore((state) => state.authentication?.id);
  const { apartmentId } = useApartmentId();
  const router = useRouter();

  const methods = useForm<VotingFormType>({
    resolver: zodResolver(votingFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      buildingPermission:
        initialData?.building === null
          ? 'all'
          : (initialData?.building?.toString() ?? 'all'),
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      options: initialData?.options.map((opt) => ({ value: opt.title, enabled: true })) ?? [
        { value: '', enabled: true },
        { value: '', enabled: true },
      ],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { isValid, errors },
  } = methods;

  const buildingPermission = watch('buildingPermission');
  const { buildingOptions } = useBuildingAndUnitOptions();


  if (!apartmentId) {
    return null;
  }

  const onSubmit = async (formData: VotingFormType) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {

      if (isEdit && initialData?.id) {
        const request: PollUpdateRequest = {
          building: formData.buildingPermission == 'all' ? null : Number(formData.buildingPermission),
          title: formData.title,
          content: formData.content,
          startDate: formData.startDate,
          endDate: formData.endDate,
          // TODO
          options: formData.options.filter((opt) => opt.enabled).map((opt) => ({ title: opt.value, id: '' }))
        }
        await updatePoll(initialData.id, request);
      } else {

        const request: PollCreateRequest = {
          building: formData.buildingPermission == 'all' ? null : Number(formData.buildingPermission),
          title: formData.title,
          content: formData.content,
          startDate: formData.startDate,
          endDate: formData.endDate,
          apartmentId,
          options: formData.options.filter((opt) => opt.enabled).map((opt) => ({ title: opt.value }))
        }
        await createPoll(request);
      }
      router.push('/admin/voting');
    } catch (error) {
      console.error(error);

      const axiosError = error as AxiosError<{ message: string }>;

      const message =
        axiosError.response?.data?.message ?? `투표 ${isEdit ? '수정' : '등록'}에 실패했습니다.`;

      alert(message);
    }
  };

  return (
    <div>
      <Title>{isEdit ? '주민투표 수정' : '주민투표 등록'}</Title>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-[40px] flex w-full flex-col gap-[20px]'
        >
          <div className='flex items-center justify-center'>
            <label className={titleStyle}>제목</label>
            <div className='w-full'>
              <Input
                className='h-[44px]'
                placeholder='제목을 입력해주세요'
                {...methods.register('title', {
                  onBlur: () => trigger('title'),
                })}
                errorText={errors.title?.message}
                color={errors.title ? 'error' : 'secondary'}
              />
            </div>
          </div>

          <div className='flex items-center'>
            <h1 className={titleStyle}>투표권자</h1>
            <Checkbox
              id='all'
              checked={buildingPermission === 'all'}
              onChange={() => setValue('buildingPermission', 'all')}
            />
            <label htmlFor='all' className='mr-[80px] ml-[15px] text-[14px] font-semibold'>
              전체
            </label>
            <Checkbox
              id='each'
              checked={buildingPermission !== 'all'}
              onChange={() => setValue('buildingPermission', buildingOptions.filter(opt => opt.value !== 'all')[0]?.value ?? '')}
            />
            <label htmlFor='each' className='mx-[15px] text-[14px] font-semibold'>
              개별
            </label>
            <Select
              className='h-[44px]'
              showPlaceholder={!isEdit}
              placeholder='전체'
              disabled={buildingPermission === 'all'}
              value={buildingPermission === 'all' ? '' : buildingPermission}
              onChange={(value) => setValue('buildingPermission', value)}
              options={buildingOptions}
            />
          </div>

          <VotingFormDate
            startAt={watch('startDate')}
            endAt={watch('endDate')}
            setStart={(value) => setValue('startDate', value.toISOString())}
            setEnd={(value) => setValue('endDate', value.toISOString())}
          />
          <VotingFormItem />

          <div className='flex'>
            <label className={titleStyle}>내용</label>
            <div className='w-full'>
              <Textarea
                placeholder='내용을 입력해주세요'
                className='min-h-[200px]'
                {...methods.register('content', {
                  onBlur: () => trigger('content'),
                })}
                errorText={errors.content?.message}
                color={errors.content ? 'error' : 'secondary'}
              />
            </div>
          </div>

          <Button
            className='mx-[75px] mt-[20px] h-[54px] w-[480px]'
            type='submit'
            disabled={!isValid}
          >
            {isEdit ? '투표 수정하기' : '투표 등록하기'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
