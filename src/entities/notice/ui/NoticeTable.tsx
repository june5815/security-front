import { AdminTableProps } from '../model/notice.types';

import { AdminNoticeCOLUMNS } from '../model/constants';
import EditDeleteBtn from '@/shared/EditDeleteBtn';
import Link from 'next/link';
import Pagination from '@/shared/Pagination';
import { formatDateToKST } from '@/shared/lib/formatDateToKST';
import useNoticeStore from '@/lib/stores/useNoticeStore';
import { useEffect } from 'react';
import { translateCategory } from '@/shared/lib/translateCategory';


export default function NoticeTable({
  currentPage,
  setCurrentPage,
  editClick,
  deleteClick,
}: AdminTableProps) {

  const { data, paginationState, updateParams, params, loading } = useNoticeStore();
  const { totalCount } = paginationState;
  const { limit, page } = params;

  const totalPages = Math.ceil(totalCount / (limit || 1));

  useEffect(() => {
    updateParams({limit: 11});
  }, []);

  return (
    <div>
      <section className='mt-6 w-full rounded-[12px] border border-gray-200 p-8 text-[14px]'>
        <table className='w-full'>
          <colgroup>
            {AdminNoticeCOLUMNS.map((col, i) => (
              <col style={{ width: col.width }} key={i} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {AdminNoticeCOLUMNS.map((col) => (
                <th className='p-3 font-medium' key={col.title}>
                  <div className='line-clamp-1'>{col.title}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={AdminNoticeCOLUMNS.length} className='p-10 text-center text-gray-400'>
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={AdminNoticeCOLUMNS.length} className='p-10 text-center text-gray-400'>
                  공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id}>
                  {AdminNoticeCOLUMNS.map((col) => (
                    <td className='p-3 text-center text-gray-500' key={col.key.toString()}>
                      <div className='line-clamp-1'>
                        {col.key === 'id' ? (
                          row.isPinned ? (
                            <span style={{ color: '#FC5A50', fontWeight: 700 }}>중요</span>
                          ) : (
                            index+1+((limit || 0) * ((page || 1) -1))
                          )
                        ) : col.key === 'title' && 'title' in row ? (
                          row.isPinned ? (
                            <Link href={`/admin/notice/detail/${row.id}`}>
                              <div
                                className='text-left'
                                style={{ color: '#FC5A50', fontWeight: 700 }}
                              >
                                {row[col.key] as string}
                              </div>
                            </Link>
                          ) : (
                            <Link href={`/admin/notice/detail/${row.id}`}>
                              <div className='text-left'>{row[col.key] as string}</div>
                            </Link>
                          )
                        ) : col.key === 'note' ? (
                          <EditDeleteBtn
                            editClick={() => editClick?.(row)}
                            deleteClick={() => deleteClick(row)}
                          />
                        ) : col.key === 'createdAt' ? (
                          <div>{formatDateToKST(row[col.key] as string)}</div>
                        ) : col.key === 'author' ? (
                          <div>{(row[col.key] as { id: string, name: string }).name}</div>
                        ) : (
                          translateCategory(row[col.key])
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
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
