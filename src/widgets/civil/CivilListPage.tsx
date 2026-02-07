import { useRouter } from 'next/router';
import { AdminCivilListFilter, ResidentCivilListFilter, statusOptions } from './CivilListFilter';
import CivilListTable from './CivilListTable';
import Pagination from '@/shared/Pagination';
import Title from '@/shared/Title';
import useAuthStore from '@/lib/stores/useAuthStore';
import useComplaintStore from '@/lib/stores/useComplaintStore';
import { useBuildingAndUnitOptions } from '@/shared/hooks/useBuildingAndUnitOptions';
import { updateComplaintStatus } from '@/lib/api/complaints';
import { useEffect } from 'react';

const ITEMS_PER_PAGE = 11;

const statusMap: Record<string, string> = Object.fromEntries(
  statusOptions.map((opt) => [opt.value, opt.label]),
);

export default function CivilListPage() {
  const { data: complaints, params, updateParams, paginationState, update: updateData, loading } = useComplaintStore();

  const { status, searchKeyword, building, unit, isPublic, page } = params;
  const { totalCount } = paginationState;

  const { buildingOptions, unitOptions } = useBuildingAndUnitOptions();

  const { pathname } = useRouter();
  const role = pathname.startsWith('/admin') ? 'admin' : 'resident';

  const { authentication } = useAuthStore();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    updateParams({limit: ITEMS_PER_PAGE});
  }, []);

  const handleStatusChange = async (complaintId: string, newStatus: 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED') => {
    try {
      const confirmed = window.confirm(`"${statusMap[newStatus]}" 상태로 변경하시겠습니까?`);
      if (!confirmed) return;

      await updateComplaintStatus(complaintId, {status: newStatus});
      updateData(complaintId, {status: newStatus});

      window.alert(
        `상태가 "${statusMap[newStatus]}"(으)로 변경되었습니다.`,
      );

    } catch (error) {
      console.error('처리 상태 업데이트 실패:', error);
      window.alert('상태 변경에 실패했습니다.');
    }
  };

  return (
    <div>
      <Title className='mb-10'>{role === 'admin' ? '민원 관리' : '민원 남기기'}</Title>

      {role === 'admin' ? (
        <AdminCivilListFilter
          status={status}
          keyword={searchKeyword}
          visibility={isPublic}
          building={building}
          unit={unit}
          onStatusChange={(val) => updateParams({status: val})}
          onKeywordChange={v => updateParams({searchKeyword: v})}
          onVisibilityChange={(val) => updateParams({isPublic: val})}
          onBuildingChange={(val) => updateParams({building: val})}
          onUnitChange={(val) => updateParams({unit: val})}
          buildingOptions={buildingOptions}
          unitOptions={unitOptions}
        />
      ) : (
        <ResidentCivilListFilter
          status={status}
          keyword={searchKeyword}
          onStatusChange={(val) => updateParams({status: val})}
          onKeywordChange={v => updateParams({searchKeyword: v})}
        />
      )}

      <CivilListTable
        data={complaints}
        currentPage={page || 1}
        itemsPerPage={ITEMS_PER_PAGE}
        onAdminStatusChange={handleStatusChange}
        currentUserId={authentication?.id}
        loading={loading}
      />

      <div className='mt-6 flex justify-center'>
        <Pagination currentPage={page || 1} setCurrentPage={page => updateParams({page})} totalPages={totalPages} />
      </div>
    </div>
  );
}
