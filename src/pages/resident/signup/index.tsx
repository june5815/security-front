import Button from '@/shared/Button';
import Input from '@/shared/Input';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Select from '@/shared/Select';
import { ResidentSignupForm, residentSignupSchema } from '@/entities/auth/schema/signup.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import SearchApartment from '@/widgets/signup/SearchApartment';
import { blockLoginUser } from '@/shared/hooks/blockLoginUser';
import useApartmentStore from '@/lib/stores/useApartmentStore';
import { ApartmentsDto, ResidentSignupRequest } from '@/lib/types';
import { createResidentUser } from '@/lib/api/users';

export const getServerSideProps = blockLoginUser();

export default function ResidentSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {data: apartments, updateParams: updateApartmentParams, params: apartmentsParams} = useApartmentStore();
  const [ selectedApartment, setSelectedApartment ] = useState<ApartmentsDto | undefined>();

  const [buildingOptions, setBuildingOptions] = useState<{ label: string; value: string }[]>([]);
  const [hoOptions, setUnitOptions] = useState<{ label: string; value: string }[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ResidentSignupForm>({
    resolver: zodResolver(residentSignupSchema()),
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedApartment) {
      setBuildingOptions(
        selectedApartment.buildings.map(building => ({label: `${building}동`, value: String(building)}))
      )
      setUnitOptions(
        selectedApartment.units.map(unit => ({label: `${unit}호`, value: String(unit)}))
      )
      setValue('apartmentId', selectedApartment.id);
    }
  }, [selectedApartment])

  const onSubmit = async (data: ResidentSignupForm) => {
    try {
      const request: ResidentSignupRequest = {
        ...data,
        resident: {
          apartmentId: data.apartmentId,
          building: parseInt(data.building),
          unit: parseInt(data.unit)
        }
      }
      await createResidentUser(request);
      router.replace('/');
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? error.response?.data?.error ?? '회원가입 실패';
        alert(message);
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  const LABEL_STYLE = 'block mb-2 text-[14px] text-gray-500';

  return (
    <div className='my-[130px] flex h-screen w-screen flex-col items-center justify-center'>
      <Link href='/'>
        <Image src='/img/logo.svg' alt='로고 이미지' width={174} height={64} />
      </Link>
      <form
        className='mt-[60px] flex flex-col items-center justify-center'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex w-[1080px] justify-between'>
          {/* 입주민 정보 */}
          <div className='w-[480px]'>
            <h1 className='text-[20px] font-semibold text-black'>아파트 입주민 정보</h1>
            <div className='mt-10 flex flex-col gap-6'>
              {[
                { id: 'username', label: '아이디', type: 'text' },
                { id: 'password', label: '비밀번호', type: showPassword ? 'text' : 'password' },
                {
                  id: 'passwordConfirm',
                  label: '비밀번호 확인',
                  type: showPasswordConfirm ? 'text' : 'password',
                },
                { id: 'contact', label: '연락처', type: 'text' },
                { id: 'name', label: '이름', type: 'text' },
                { id: 'email', label: '이메일', type: 'text' },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label className={LABEL_STYLE} htmlFor={id}>
                    {label}
                  </label>
                  <Input
                    id={id}
                    type={type}
                    placeholder={`${label}를 입력해주세요`}
                    {...register(id as keyof ResidentSignupForm)}
                    errorText={errors[id as keyof ResidentSignupForm]?.message}
                    color={errors[id as keyof ResidentSignupForm] ? 'error' : 'secondary'}
                  >
                    {id === 'password' && (
                      <button
                        type='button'
                        className='cursor-pointer'
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <Image
                          src={showPassword ? '/img/visibility_on.svg' : '/img/visibility_off.svg'}
                          alt='비밀번호 표시 아이콘'
                          width={24}
                          height={24}
                        />
                      </button>
                    )}
                    {id === 'passwordConfirm' && (
                      <button
                        type='button'
                        className='cursor-pointer'
                        onClick={() => setShowPasswordConfirm((prev) => !prev)}
                      >
                        <Image
                          src={
                            showPasswordConfirm
                              ? '/img/visibility_on.svg'
                              : '/img/visibility_off.svg'
                          }
                          alt='비밀번호 확인 표시 아이콘'
                          width={24}
                          height={24}
                        />
                      </button>
                    )}
                  </Input>
                </div>
              ))}
            </div>
          </div>

          {/* 아파트 정보 */}
          <div className='w-[540px] border-l border-gray-100 pl-[60px]'>
            <h1 className='text-[20px] font-semibold text-black'>아파트 정보</h1>
            <div className='mt-[40px] flex flex-col gap-[24px]'>
              <div>
                <label className={LABEL_STYLE} htmlFor='apartmentName'>
                  입주 아파트명
                </label>
                <SearchApartment
                  searchKeyword={apartmentsParams.searchKeyword}
                  onChangeSearchKeyword={(val) => updateApartmentParams({searchKeyword: val})}
                  selectedApartment={selectedApartment}
                  onSelect={setSelectedApartment}
                  apartmentList={apartments}
                />
              </div>

              <div className='flex gap-6'>
                <div className='w-1/2'>
                  <label className={LABEL_STYLE} htmlFor='apartmentDong'>
                    동
                  </label>
                  <Select
                    showPlaceholder={true}
                    placeholder='동 선택'
                    options={buildingOptions}
                    width='w-full'
                    className={errors.building ? 'border-red' : ''}
                    onChange={(v) => {
                      setValue('building', v, { shouldValidate: true });
                    }}
                  />
                </div>
                <div className='w-1/2'>
                  <label className={LABEL_STYLE} htmlFor='apartmentHo'>
                    호수
                  </label>
                  <Select
                    showPlaceholder={true}
                    placeholder='호수 선택'
                    options={hoOptions}
                    width='w-full'
                    className={errors.unit ? 'border-red' : ''}
                    onChange={(v) => {
                      setValue('unit', v, { shouldValidate: true });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button className='mt-[60px] w-[480px]' disabled={!isValid}>
          시작하기
        </Button>
        <div className='mt-10 flex gap-2 text-[14px]'>
          <span className='text-gray-500'>관리자이신가요?</span>
          <Link href='/admin/signup'>
            <span className='text-main underline'>신규 아파트 신청하기</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
