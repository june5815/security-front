import { useRouter } from 'next/router';
import StatusChip from '@/entities/civil/ui/StatusChip';
import Link from 'next/link';
import Select from '@/shared/Select';
import { statusOptions } from './CivilListFilter';
import { ComplaintsDto } from '@/lib/types';

type Props = {
  data: ComplaintsDto[];
  currentPage: number;
  loading: boolean;
  itemsPerPage: number;
  currentUserId?: string;
  onAdminStatusChange?: (complaintId: string, newStatus: 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED') => void;
};

export default function CivilListTable({
  data,
  currentPage,
  loading,
  itemsPerPage,
  onAdminStatusChange,
  currentUserId,
}: Props) {
  const tdClass = 'p-3 text-center text-gray-500';
  const thClass = 'p-3 font-medium';

  const { pathname } = useRouter();
  const isAdmin = pathname.includes('/admin');

  const filteredData = data;

  return (
    <>
      <section className='mt-6 w-full rounded-[12px] border border-gray-200 p-8 text-[14px]'>
        <table className='w-full table-fixed'>
          <colgroup>
            <col style={{ width: '100px' }} />
            <col />
            <col style={{ width: '180px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
            <col style={isAdmin ? { width: '124px' } : { width: '100px' }} />
          </colgroup>
          <thead>
            <tr>
              <th className={thClass}>No.</th>
              <th className={thClass}>제목</th>
              <th className={thClass}>작성자</th>
              <th className={thClass}>작성 일시</th>
              <th className={thClass}>공개</th>
              <th className={thClass}>조회수</th>
              <th className={thClass}>댓글 수</th>
              <th className={thClass}>처리 상태</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className='p-10 text-center text-gray-400'>
                  데이터 로딩 중...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className='p-10 text-center text-gray-400'>
                  아직 작성된 민원이 없습니다.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const no = index+1+((itemsPerPage || 0) * ((currentPage || 1) -1))
                const isOwn = item.complainant.id === currentUserId;

                return (
                  <tr key={item.id}>
                    <td className={tdClass}>
                      <div className='line-clamp-1' title={String(no)}>
                        {no}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1 text-left' title={item.title}>
                        <Link
                          href={`/${isAdmin ? 'admin' : 'resident'}/civil/detail/${item.id}`}
                          className='hover:underline'
                          onClick={(e) => {
                            if (!item.isPublic && !isOwn && !isAdmin) {
                              e.preventDefault();
                              alert('비공개 민원은 작성자만 열람 가능합니다.');
                            }
                          }}
                        >
                          {item.title}
                        </Link>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1' title={item.complainant.name}>
                        {item.complainant.name}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1' title={item.createdAt}>
                        {item.createdAt}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1'>
                        <StatusChip type='visibility' status={item.isPublic ? '공개' : '비공개'} />
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1' title={String(item.viewsCount)}>
                        {item.viewsCount}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className='line-clamp-1' title={String(item.commentCount)}>
                        {item.commentCount}
                      </div>
                    </td>
                    {isAdmin ? (
                      <td className={tdClass}>
                        <div className='text-left'>
                          <Select
                            options={statusOptions}
                            defaultValue={item.status}
                            small={true}
                            onChange={(val) => {
                              onAdminStatusChange?.(item.id, val as 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED');
                            }}
                          />
                        </div>
                      </td>
                    ) : (
                      <td className={tdClass}>
                        <div className='line-clamp-1'>
                          <StatusChip
                            type='process'
                            status={
                              item.status === 'PENDING'
                                ? '접수전'
                                : item.status === 'IN_PROGRESS'
                                  ? '처리중'
                                  : '처리완료'
                            }
                          />
                        </div>
                      </td>
                    )}
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
