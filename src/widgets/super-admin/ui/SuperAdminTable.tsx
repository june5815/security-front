import StatusChip from '@/entities/apartmentRequest/ui/StatusChip';
import Image from 'next/image';
import Input from '@/shared/Input';
import Modal from '@/shared/Modal';
import Button from '@/shared/Button';
import { useEffect, useState } from 'react';
import Textarea from '@/shared/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApartmentEditFormValues,
  apartmentEditSchema,
} from '@/entities/apartmentRequest/schema/apartmentEdit.schema';

import { formatPhoneNum } from '@/shared/hooks/formatPhoneNum';
import useAdminUserStore from '@/lib/stores/useAdminUserStore';
import { AdminUserDto, AdminUserUpdateRequest } from '@/lib/types';
import { deleteAdminUser, updateAdminUser, updateAdminUserJoinStatus } from '@/lib/api/users';

export default function SuperAdminTable() {
  const { data, delete: deleteData, update: updateData, params, loading } = useAdminUserStore();
  const { limit, page } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminUserDto | null>(null);
  const tdClass = 'p-3 text-center text-gray-500';
  const thClass = 'p-3 font-medium';
  const LABEL_STYLE = 'mb-2 text-[14px] text-gray-500 mt-[16px]';

  const handleClose = () => {
    if (selectedItem) {
      reset(selectedItem);
    }
    setIsOpen(false);
  };

  const handleApprove = async (id: string) => {
    try {
      await updateAdminUserJoinStatus(id, { joinStatus: 'APPROVED' });
      updateData(id, {joinStatus: 'APPROVED'})
      alert('승인 완료');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('승인 실패');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateAdminUserJoinStatus(id, { joinStatus: 'REJECTED' });
      updateData(id, {joinStatus: 'REJECTED'})
      alert('거절 완료');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('거절 실패');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminUser(id);
      deleteData(id);
      alert('관리자 삭제 처리 완료');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('관리자 삭제 처리 실패');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<ApartmentEditFormValues>({
    resolver: zodResolver(apartmentEditSchema),
    defaultValues: selectedItem ? {
      name  : selectedItem.adminOf.name,
      address: selectedItem.adminOf.address,
      officeNumber: selectedItem.adminOf.officeNumber ? selectedItem.adminOf.officeNumber : undefined ,
      description: selectedItem.adminOf.description ? selectedItem.adminOf.description : undefined,
      adminName: selectedItem.name,
      adminContact: selectedItem.contact,
      adminEmail: selectedItem.email,
    } :  undefined,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedItem) {
      reset({
        name  : selectedItem.adminOf.name,
        address: selectedItem.adminOf.address,
        officeNumber: selectedItem.adminOf.officeNumber ? selectedItem.adminOf.officeNumber : undefined ,
        description: selectedItem.adminOf.description ? selectedItem.adminOf.description : undefined,
        adminName: selectedItem.name,
        adminContact: selectedItem.contact,
        adminEmail: selectedItem.email,
      });
    }
  }, [selectedItem, reset]);

  const onSubmit = async (formData: ApartmentEditFormValues) => {
    if (!selectedItem) return;

    const id = selectedItem.id;

    try {
      const request: AdminUserUpdateRequest = {
        email: formData.adminEmail,
        contact: formData.adminContact,
        name: formData.adminName,
        adminOf: {
          description: formData.description,
          officeNumber: formData.officeNumber,
          name: formData.name,
          address: formData.address
        }
      };

      await updateAdminUser(id, request);
      updateData(id, {
        email: request.email,
        contact: request.contact,
        name: request.name,
        adminOf: {
          description: formData.description,
          officeNumber: formData.officeNumber,
          name: formData.name,
          address: formData.address,
          id: selectedItem.adminOf.id
        }
      })
      alert('관리자 정보 수정 완료');
      handleClose();
    } catch (error) {
      console.error(error);
      alert('관리자 정보 수정 실패');
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedItem && (
          <form className='p-6' onSubmit={handleSubmit(onSubmit)}>
            <h3 className='mb-6 text-center text-[18px] font-semibold'>수정하기</h3>

            <Input
              label='아파트명'
              labelClass={LABEL_STYLE}
              {...register('name')}
              errorText={errors.name?.message}
              color={errors.name ? 'error' : 'secondary'}
            />
            <Input
              label='주소'
              labelClass={LABEL_STYLE}
              {...register('address')}
              errorText={errors.address?.message}
              color={errors.address ? 'error' : 'secondary'}
            />
            <Input
              label='관리소 번호'
              labelClass={LABEL_STYLE}
              {...register('officeNumber')}
              errorText={errors.officeNumber?.message}
              color={errors.officeNumber ? 'error' : 'secondary'}
            />
            <Textarea
              label='소개'
              labelClass={LABEL_STYLE}
              {...register('description')}
              errorText={errors.description?.message}
              color={errors.description ? 'error' : 'secondary'}
            />
            <Input
              label='관리자명'
              labelClass={LABEL_STYLE}
              {...register('adminName')}
              errorText={errors.adminName?.message}
              color={errors.adminName ? 'error' : 'secondary'}
            />
            <Input
              label='연락처'
              labelClass={LABEL_STYLE}
              {...register('adminContact')}
              errorText={errors.adminContact?.message}
              color={errors.adminContact ? 'error' : 'secondary'}
            />
            <Input
              label='이메일'
              labelClass={LABEL_STYLE}
              {...register('adminEmail')}
              errorText={errors.adminEmail?.message}
              color={errors.adminEmail ? 'error' : 'secondary'}
            />

            <div className='mt-6 flex justify-center gap-3'>
              <Button outline className='w-[120px]' onClick={handleClose}>
                닫기
              </Button>
              <Button className='w-[120px]' type='submit' disabled={!isDirty || !isValid}>
                수정하기
              </Button>
            </div>
          </form>
        )}
      </Modal>
      <section className='mt-6 w-full rounded-[12px] border border-gray-200 p-8 text-[14px]'>
        <table className='w-full table-fixed'>
          <colgroup>
            <col style={{ width: '100px' }} />
            <col style={{ width: '245px' }} />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
          </colgroup>
          <thead>
            <tr>
              <th className={thClass}>
                <div className='line-clamp-1'>No.</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>아파트명</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>주소</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>아파트 관리자명</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>연락처</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>이메일</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>승인 상태</div>
              </th>
              <th className={thClass}>
                <div className='line-clamp-1'>비고</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className='p-8 text-center text-gray-500'>
                  불러오는 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className='p-8 text-center text-gray-500'>
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.id}>
                      {index+1+((limit || 0) * ((page || 1) -1))}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.adminOf.name}>
                      {item.adminOf.name}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.adminOf.address}>
                      {item.adminOf.address}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.name}>
                      {item.name}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.contact}>
                      {formatPhoneNum(item.contact)}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1' title={item.email}>
                      {item.email}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className='line-clamp-1'>
                      <StatusChip type='approval' status={item.joinStatus} />
                    </div>
                  </td>
                  <td className={tdClass}>
                    {item.joinStatus === 'PENDING' ? (
                      <ul className='flex items-center justify-center gap-4'>
                        <li>
                          <button
                            className='text-main cursor-pointer'
                            onClick={() => handleApprove(item.id)}
                          >
                            승인
                          </button>
                        </li>
                        <li>
                          <button
                            className='cursor-pointer text-gray-300'
                            onClick={() => handleReject(item.id)}
                          >
                            거절
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <ul className='flex items-center justify-center gap-4'>
                        <li>
                          <button
                            className='cursor-pointer'
                            onClick={() => {
                              console.log({item})
                              setSelectedItem(item);
                              setIsOpen(true);
                            }}
                          >
                            <Image src='/icon_edit.svg' alt='수정하기' width={20} height={20} />
                          </button>
                        </li>
                        <li>
                          <button
                            className='cursor-pointer'
                            onClick={() => {
                              handleDelete(item.id);
                            }}
                          >
                            <Image src='/icon_remove.svg' alt='삭제하기' width={20} height={20} />
                          </button>
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
