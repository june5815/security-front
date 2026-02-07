import { useCallback, useEffect, useState } from 'react';

import DeleteModal from '@/shared/DeleteModal';
import Image from 'next/image';
import Input from '@/shared/Input';
import NoticeTable from '@/entities/notice/ui/NoticeTable';
import Select from '@/shared/Select';
import { useRouter } from 'next/router';
import useNoticeStore from '@/lib/stores/useNoticeStore';
import { NoticeDto } from '@/lib/types';
import { deleteNotice } from '@/lib/api/notices';
import { SELECT_OPTIONS } from '@/entities/notice/model/constants';

const SELECT_OPTIONS_WITH_ALL = [
  { value: '전체', label: '전체' },
  ...SELECT_OPTIONS,
]

export default function AdminNoticePage() {
  const { params: noticeParams, updateParams: updateNoticeParams, delete: deleteData } = useNoticeStore();
  const { searchKeyword } = noticeParams;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');
  const router = useRouter();

  useEffect(() => {

  }, [currentPage]);

  // Debounce 효과: 입력이 멈춘 후 300ms 후에 실제 검색 키워드 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNoticeParams({ searchKeyword: localSearchKeyword });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchKeyword, updateNoticeParams]);

  // 모달 상태 관리
  const [openModal, setOpenModal] = useState<null | 'delete'>(null);
  const handleModalClose = () => setOpenModal(null);

  const handleEditClick = (row: NoticeDto) => {
    router.push(`/admin/notice/edit/${row.id}`);
  };

  const handleDeleteClick = (row: NoticeDto) => {
    setSelectedNoticeId(row.id);
    setOpenModal('delete');
  };

  const handleDeleteSubmit = async () => {
    if (!selectedNoticeId) return;
    try {
      await deleteNotice(selectedNoticeId);
      deleteData(selectedNoticeId);
      setOpenModal(null);
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  const handleChangeNotceCategory = useCallback((category: string) => {
    switch (category) {
      case 'MAINTENANCE':
      case 'EMERGENCY':
      case 'COMMUNITY':
      case 'RESIDENT_VOTE':
      case 'RESIDENT_COUNCIL':
      case 'ETC': {
        updateNoticeParams({category});
        break;
      }
      case 'all':
      default:  {
        updateNoticeParams({category: undefined});
      }
    }
  }, []);

  return (
    <>
      <h1 className='mb-10 text-[26px] font-bold'>공지사항</h1>
      <div className='mb-5'>
        <Select
          label='분류'
          options={SELECT_OPTIONS_WITH_ALL}
          onChange={handleChangeNotceCategory}
        />
      </div>

      <div className='flex items-end justify-between'>
        <div>
          <label className='mb-3 block text-[14px] font-semibold'>검색</label>
          <Input
            color='search'
            placeholder='검색어를 입력해 주세요'
            childrenPosition='left'
            value={localSearchKeyword}
            onChange={(e) => setLocalSearchKeyword(e.target.value)}
          >
            <Image src='/icon_search.svg' alt='검색버튼' width={24} height={24} />
          </Input>
        </div>

        <button
          className='bg-main h-[44px] w-full max-w-[120px] cursor-pointer rounded-xl text-sm text-white'
          onClick={() => router.push('/admin/notice/create')}
        >
          공지사항 등록
        </button>
      </div>

      <NoticeTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        editClick={handleEditClick}
        deleteClick={handleDeleteClick}
      />

      {openModal === 'delete' && (
        <DeleteModal
          isModalOpen={true}
          setIsModalOpen={handleModalClose}
          onDelete={handleDeleteSubmit}
        />
      )}
    </>
  );
}
