import React, { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/helper';
import Pagination from '@/shared/Pagination';
import useNoticeStore from '@/lib/stores/useNoticeStore';
import { NoticeDto } from '@/lib/types';

const CATEGORY_LABEL_MAP = {
  MAINTENANCE: '정기점검',
  EMERGENCY: '긴급점검',
  COMMUNITY: '공동생활',
  RESIDENT_VOTE: '주민투표',
  RESIDENT_COUNCIL: '주민회의',
  ETC: '기타',
} as const;

export default function ResidentNoticeTable() {
  const { data: notices, params, paginationState, updateParams, loading } = useNoticeStore();
  const { page: currentPage, limit: pageSize } = params;
  const { totalCount } = paginationState;
  
  useEffect(() => {
    updateParams({limit: 11});
  }, []);
  
  const totalPages = Math.ceil(totalCount / (pageSize || 11));
  
  const COLUMNS: { key: keyof NoticeDto | 'no'; title: string; width: string }[] = [
    { key: 'no', title: 'NO.', width: '100px' },
    { key: 'category', title: '분류', width: '100px' },
    { key: 'title', title: '제목', width: '' },
    { key: 'author', title: '작성자', width: '180px' },
    { key: 'createdAt', title: '등록일시', width: '180px' },
    { key: 'viewsCount', title: '조회수', width: '100px' },
    { key: 'commentCount', title: '댓글 수', width: '100px' },
  ];

  return (
    <>
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
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className='p-10 text-center text-gray-400'>
                  공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice, index) => {
                const num = index+1+((pageSize || 0) * ((currentPage || 1) -1));

                return (
                  <tr key={notice.id}>
                    {COLUMNS.map((col) => (
                      <td className='p-3 text-center text-gray-500' key={col.key}>
                        <div className='line-clamp-1'>
                          {col.key === 'no' ? (
                            <span className={notice.isPinned ? 'font-semibold text-red-500' : ''}>
                              {notice.isPinned ? '중요' : num}
                            </span>
                          ) : col.key === 'title' ? (
                            <div className={cn('text-left', notice.isPinned ? 'text-red-500' : '')}>
                              <Link
                                href={`/resident/notice/detail/${notice.id}`}
                                className='hover:underline'
                              >
                                {notice.title}
                              </Link>
                            </div>
                          ) : col.key === 'category' ? (
                            CATEGORY_LABEL_MAP[notice.category]
                          ) : col.key === 'author' ? (
                            <>{notice.author.name}</>
                          ) : (
                            notice[col.key]
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
      <div className='mt-6 flex justify-center'>
        <Pagination
          currentPage={currentPage || 1}
          setCurrentPage={page => updateParams({page})}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
