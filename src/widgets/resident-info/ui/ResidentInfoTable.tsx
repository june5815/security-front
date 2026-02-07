import StatusChip from '@/entities/resident-info/ui/StatusChip';
import { ResidentUserDto } from '@/lib/types';
import { updateResidentUserJoinStatus } from '@/lib/api/users';

type Props = {
  data: ResidentUserDto[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
};

export default function ResidentInfoTable({ data, currentPage, itemsPerPage, loading }: Props) {
  const getApprovalLabel = (status: string) => {
    if (status === 'PENDING') return '대기';
    if (status === 'APPROVED') return '승인';
    if (status === 'REJECTED') return '거절';
    return status;
  };

  const handleApprove = async (id: string) => {
    try {
      await updateResidentUserJoinStatus(id, {joinStatus: 'APPROVED'})
      alert('승인 완료');
      location.reload();
    } catch {
      alert('승인 실패');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateResidentUserJoinStatus(id, {joinStatus: 'REJECTED'})
      alert('거절 완료');
      location.reload();
    } catch {
      alert('거절 실패');
    }
  };

  const tdClass = 'p-3 text-center text-gray-500';
  const thClass = 'p-3 font-medium';

  return (
    <>
      <section className='mt-6 w-full rounded-[12px] border border-gray-200 p-8 text-[14px]'>
        <table className='w-full table-fixed'>
          <colgroup>
            <col style={{ width: '100px' }} />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
          </colgroup>
          <thead>
            <tr>
              <th className={thClass}>No.</th>
              <th className={thClass}>동</th>
              <th className={thClass}>호</th>
              <th className={thClass}>이름</th>
              <th className={thClass}>연락처</th>
              <th className={thClass}>이메일</th>
              <th className={thClass}>승인 상태</th>
              <th className={thClass}>비고</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className='p-6 text-center text-gray-400'>
                  불러오는 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className='p-6 text-center text-gray-400'>
                  해당 입주민 계정이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const no = index+1+((itemsPerPage || 0) * ((currentPage || 1) -1));
                return (
                  <tr key={item.id}>
                    <td className={tdClass}>{no}</td>
                    <td className={tdClass}>{item.resident.building}</td>
                    <td className={tdClass}>{item.resident.unit}</td>
                    <td className={tdClass}>{item.name}</td>
                    <td className={tdClass}>
                      {item.contact.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')}
                    </td>
                    <td className={tdClass}>{item.email}</td>
                    <td className={tdClass}>
                      <StatusChip status={getApprovalLabel(item.joinStatus)} />
                    </td>
                    <td className={tdClass}>
                      {item.joinStatus === 'PENDING' && (
                        <ul className='flex items-center justify-center gap-4'>
                          <li>
                            <button
                              className='text-main cursor-pointer'
                              onClick={() => handleApprove(String(item.id))}
                            >
                              승인
                            </button>
                          </li>
                          <li>
                            <button
                              className='cursor-pointer text-gray-300'
                              onClick={() => handleReject(String(item.id))}
                            >
                              거절
                            </button>
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
