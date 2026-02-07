import ResidentInfoFilter from './ResidentInfoFilter';
import ResidentInfoTable from './ResidentInfoTable';
import Pagination from '@/shared/Pagination';
import Title from '@/shared/Title';
import useResidentUserStore from '@/lib/stores/useResidentUserStore';
import { useEffect } from 'react';

export default function ResidentInfoPage() {
  const { data, params, updateParams, paginationState, loading } = useResidentUserStore();

  const { building, unit, joinStatus, searchKeyword } = params;
  const { totalCount, nextPage } = paginationState;

  const ITEMS_PER_PAGE = 11;
  const currentPage = nextPage - 1;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    updateParams({limit: ITEMS_PER_PAGE});
  }, []);

  return (
    <div>
      <Title className='mb-10'>입주민 계정 관리</Title>
      <ResidentInfoFilter
        building={building}
        unit={unit}
        joinStatus={joinStatus}
        searchKeyword={searchKeyword}
        onBuildingChange={v => updateParams({building: v})}
        onUnitNumberChange={v => updateParams({unit: v})}
        onJoinStatusChange={v => updateParams({joinStatus: v})}
        onSearchKeywordChange={v => updateParams({searchKeyword: v})}
      />
      <ResidentInfoTable
        data={data}
        currentPage={currentPage}
        itemsPerPage={11}
        loading={loading}
      />
      <div className='mt-6 flex justify-center'>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={page => updateParams({page})}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
