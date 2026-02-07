import SuperAdminFilter from './SuperAdminFilter';
import SuperAdminTable from './SuperAdminTable';
import Pagination from '@/shared/Pagination';
import Title from '@/shared/Title';
import useAdminUserStore from '@/lib/stores/useAdminUserStore';
import { useEffect } from 'react';

export default function SuperAdminPage() {
  const { paginationState, updateParams } = useAdminUserStore();
  const { totalCount, nextPage } = paginationState;

  const ITEMS_PER_PAGE = 11;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const currentPage = nextPage - 1;

  useEffect(() => {
    updateParams({limit: ITEMS_PER_PAGE})
  }, []);

  const setCurrentPage = (page: number) => {
    updateParams({page})
  }

  return (
    <div>
      <Title className='mb-10'>아파트 관리</Title>
      <SuperAdminFilter />
      <SuperAdminTable />
      <div className='mt-6 flex justify-center'>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
