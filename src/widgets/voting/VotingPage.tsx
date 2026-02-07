import Title from '@/shared/Title';
import VotingFilter from './VotingFilter';
import VotingTable from './VotingTable';
import Pagination from '@/shared/Pagination';
import usePollStore from '@/lib/stores/usePollStore';
import { PollStatus } from '@/lib/types';
import { useEffect } from 'react';

const ITEMS_PER_PAGE = 11;

export default function VotingPage() {
  const { data, params, paginationState, updateParams, loading} = usePollStore();
  const { building, status, searchKeyword, page } = params;
  const { totalCount } = paginationState;

  useEffect(() => {
    updateParams({limit: ITEMS_PER_PAGE});
  }, []);


  const handleBuildingChange = (building?: number) => {
    updateParams({building})
  };

  const handleStatusChange = (status?: PollStatus) => {
    updateParams({status})
  };

  const handleKeywordSearch = (keyword?: string) => {
    updateParams({searchKeyword: keyword})
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <Title>주민투표 관리</Title>
      <VotingFilter
        building={building}
        status={status}
        searchKeyword={searchKeyword}
        onChangeBuilding={handleBuildingChange}
        onChangeStatus={handleStatusChange}
        onSearchKeyword={handleKeywordSearch}
      />
      <VotingTable
        data={data}
        currentPage={page || 1}
        itemsPerPage={ITEMS_PER_PAGE}
        loading={loading}
      />
      <div className='mt-[24px] flex w-full justify-center'>
        <Pagination
          currentPage={page || 1}
          setCurrentPage={page => updateParams({page})}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
