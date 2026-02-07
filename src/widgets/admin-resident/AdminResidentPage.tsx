import { useCallback, useEffect, useState } from 'react';

import AddFileModal from '@/entities/admin-resident/ui/AddFileModal';
import AdminButton from '@/entities/admin-resident/ui/AdminButton';
import { AdminResidentCOLUMNS } from '@/entities/admin-resident/model/constants';
import DeleteModal from '@/shared/DeleteModal';
import EditResidentModal from '@/entities/admin-resident/ui/EditResidentModal';
import Pagination from '@/shared/Pagination';
import RegisterSingleModal from '@/entities/admin-resident/ui/RegisterSingleModal';
import ResidentTable from '@/entities/admin-resident/ui/ResidentTable';
import SearchBar from '@/entities/admin-resident/ui/SearchBar';
import SelectFilters from '@/entities/admin-resident/ui/SelectFilters';
import { useModal } from '@/entities/admin-resident/model/useModal';
import useResidentStore from '@/lib/stores/useResidentStore';
import { ResidentCreateRequest, ResidentDto, ResidentUpdateRequest } from '@/lib/types';
import {
  createResident,
  deleteResident,
  downloadResidentTemplate,
  exportResidentsToFile,
  updateResident,
} from '@/lib/api/residents';

export default function AdminResidentPage() {
  const {
    data,
    fetch,
    add: addData,
    update: updateData,
    delete: deleteData,
    paginationState,
    params: residentParams,
    updateParams,
    loading,
  } = useResidentStore();

  const { totalCount, nextPage } = paginationState;

  const [selectedResident, setSelectedResident] = useState<ResidentDto | undefined>(undefined);

  const { openModal, handleModalOpen, handleModalClose } = useModal<
    'addFile' | 'addSingle' | 'edit' | 'delete'
  >();

  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = nextPage - 1;
  const startingIndex = totalCount - (currentPage - 1) * pageSize;

  useEffect(() => {
    updateParams({ limit: pageSize });
  }, []);

  const handleEditClick = (resident: ResidentDto) => {
    setSelectedResident(resident);
    handleModalOpen('edit')();
  };

  const handleDeleteClick = (resident: ResidentDto) => {
    setSelectedResident(resident);
    handleModalOpen('delete')();
  };

  // 입주민 개별 등록
  const handleRegistration = async (formData: ResidentCreateRequest): Promise<void> => {
    try {
      const created = await createResident(formData);
      addData(created);
    } catch (error) {
      console.error('등록 실패:', error);
    }
  };

  // 입주민 개별 수정
  const handleEditsubmit = async (formData: ResidentUpdateRequest) => {
    if (!selectedResident) return;
    try {
      await updateResident(selectedResident.id, formData);
      updateData(selectedResident.id, formData);
      handleModalClose();
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };

  // 입주민 개별 삭제
  const handleDeleteSubmit = async () => {
    if (!selectedResident) return;
    try {
      await deleteResident(selectedResident.id);
      deleteData(selectedResident.id);
      handleModalClose();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const createDownloadLink = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClickDownloadForm = async () => {
    const blob = await downloadResidentTemplate();
    createDownloadLink(blob, '입주민_업로드_양식.csv');
  };

  const handleClickExport = useCallback(async () => {
    const blob = await exportResidentsToFile(residentParams);
    createDownloadLink(blob, '입주민_명부.csv');
  }, [residentParams]);

  return (
    <>
      <h1 className='mb-10 text-[26px] font-bold'>입주민 명부 관리</h1>
      <SelectFilters />

      <div className='mt-5 flex items-end justify-between'>
        <SearchBar
          value={residentParams.searchKeyword || ''}
          onChange={(v) => updateParams({ searchKeyword: v })}
        />

        <div className='flex min-w-[568px] gap-8'>
          <AdminButton title='파일등록' onClick={handleModalOpen('addFile')} />
          <AdminButton title='개별등록' onClick={handleModalOpen('addSingle')} />
          <AdminButton title='양식 다운로드' onClick={handleClickDownloadForm} />
          <AdminButton title='명부 다운로드' onClick={handleClickExport} />
        </div>
      </div>

      <ResidentTable
        data={data}
        startingIndex={startingIndex}
        COLUMNS={AdminResidentCOLUMNS}
        editClick={handleEditClick}
        deleteClick={handleDeleteClick}
        loading={loading}
      />

      <div className='mt-6 flex justify-center'>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={(page) => updateParams({ page })}
          totalPages={totalPages}
        />
      </div>

      {openModal === 'addFile' && (
        <AddFileModal isModalOpen={true} handleModalClose={handleModalClose} fetchData={fetch} />
      )}

      {openModal === 'addSingle' && (
        <RegisterSingleModal
          isModalOpen={true}
          setIsModalOpen={handleModalClose}
          onSubmit={handleRegistration}
        />
      )}

      {openModal === 'edit' && (
        <EditResidentModal
          isModalOpen={true}
          setIsModalOpen={handleModalClose}
          onSubmit={handleEditsubmit}
          resident={selectedResident}
        />
      )}

      {openModal === 'delete' && selectedResident && (
        <DeleteModal
          isModalOpen={true}
          setIsModalOpen={handleModalClose}
          onDelete={handleDeleteSubmit}
        />
      )}
    </>
  );
}
