import { AdminResidentTable } from '../model/adminNotice.types';
import BgChip from '@/entities/admin-resident/ui/BgChip';
import EditDeleteBtn from '@/shared/EditDeleteBtn';
import useResidentStore from '@/lib/stores/useResidentStore';

export default function ResidentTable({
  data,
  startingIndex,
  COLUMNS,
  editClick,
  deleteClick,
  loading
}: AdminResidentTable) {
  function formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }

  const isEmpty = !data || data.length === 0;

  const { limit, page } = useResidentStore(state => state.params);

  return (
    <section className='mt-6 w-full rounded-[12px] border border-gray-200 p-8 text-[14px]'>
      <table className='w-full table-fixed'>
        <colgroup>
          {COLUMNS.map((col, i) => (
            <col style={{ width: col.width }} key={i} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th className='p-3 font-medium' key={col.title}>
                <div className='line-clamp-1'>{col.title}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COLUMNS.length} className='p-10 text-center text-gray-400'>
                불러오는 중...
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={COLUMNS.length} className='p-10 text-center text-gray-400'>
                아직 입주민 정보가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const index = startingIndex + idx;
              return (
                <tr key={index}>
                  {COLUMNS.map((col) => (
                    <td className='p-3 text-center text-gray-500' key={col.key.toString()}>
                      <div className='line-clamp-1'>
                        {col.key === 'id' ? (
                          idx+1+((limit || 0) * ((page || 1) -1))
                        ) : col.key === 'note' ? (
                          <EditDeleteBtn
                            editClick={() => editClick(row)}
                            deleteClick={() => deleteClick(row)}
                          />
                        ) : col.key === 'contact' ? (
                          formatPhone(row.contact)
                        ) : ['isHouseholder', 'isRegistered'].includes(col.key.toString()) ? (
                          <BgChip>
                            {col.key === 'isRegistered'
                              ?
                              row.userId
                                ? '가입'
                                : '미가입'
                              :
                              row.isHouseholder
                              ? '세대주':'세대원'
                            }
                          </BgChip>
                        ) : (
                          ((row as never)[col.key] as React.ReactNode)
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
