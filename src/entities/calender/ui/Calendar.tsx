import { DAY_LABELS, getMonthMatrix, MONTH_LABELS, toYMDHM } from '../model/calendar.utils';
import { useEffect } from 'react';
import Image from 'next/image';
import useEventStore from '@/lib/stores/useEventStore';
import { useApartmentId } from '@/shared/hooks/useApartmentId';

// KST
function toKST(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

function toLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDateInRange(cellDate: Date, start: string, end: string): boolean {
  const kstCell = toKST(cellDate);
  const kstStart = toKST(start);
  const kstEnd = toKST(end);

  const cellYMD = toLocalYMD(kstCell);
  const startYMD = toLocalYMD(kstStart);
  const endYMD = toLocalYMD(kstEnd);

  return cellYMD >= startYMD && cellYMD <= endYMD;
}

export default function Calendar() {
  const { data, updateParams, params } = useEventStore();
  const { year, month } = params;

  const { apartmentId } = useApartmentId();

  useEffect(() => {
    if (apartmentId) {
      updateParams({apartmentId})
    }
  }, [apartmentId]);

  const changeMonth = (diff: number) => {
    let newMonth = month + diff;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    updateParams({year: newYear, month: newMonth});
  };

  const weeks = getMonthMatrix(year, month - 1);
  const rowHeight = weeks.length === 6 ? 'h-[118px]' : 'h-[142px]';

  function translateStatus(value: string) {
    if (value === 'MAINTENANCE') {
      return '정기점검';
    } else if (value === 'RESIDENT_VOTE') {
      return '주민투표';
    } else if (value === 'COMPLAINT') {
      return '민원';
    } else {
      return '일정';
    }
  }

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {/* 상단 년월 & 화살표 */}
      <div className='mb-4 flex h-[44px] w-[186px] items-center justify-between'>
        <button
          onClick={() => changeMonth(-1)}
          aria-label='이전 달'
          className='cursor-pointer hover:opacity-80'
        >
          <Image src={'/img/leftArrow.svg'} width={7.5} height={24} alt='이전 달' />
        </button>
        <div className='text-xl font-semibold text-gray-800 select-none'>
          {year}년 {MONTH_LABELS[month-1]}
        </div>
        <button
          onClick={() => changeMonth(1)}
          aria-label='다음 달'
          className='cursor-pointer hover:opacity-80'
        >
          <Image src={'/img/rightArrow.svg'} width={7.5} height={24} alt='다음 달' />
        </button>
      </div>

      {/* 캘린더 */}
      <table className='w-full border-separate border-spacing-0'>
        <thead>
          <tr>
            {/* 일-토 */}
            {DAY_LABELS.map((d, i) => (
              <th
                key={d}
                className={`h-[45px] border border-gray-100 text-lg font-normal ${
                  i === 0 ? 'text-red' : 'text-gray-500'
                }`}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* 날짜 */}
          {weeks.map((week, i) => (
            <tr key={i} className='max-h-[710px]'>
              {week.map((cell, j) => {
                const cellEvents = data.filter((e) =>
                  isDateInRange(cell.date, e.startDate, e.endDate),
                );

                return (
                  <td
                    key={cell.date.toISOString()}
                    className={`${rowHeight} w-1/7 border border-gray-100 px-2 py-1 align-top ${
                      j === 0 ? 'text-red-400' : ''
                    }`}
                  >
                    <div
                      className={`text-sm ${
                        cell.muted
                          ? 'text-gray-300'
                          : j === 0
                            ? 'font-medium text-red-400'
                            : 'font-medium text-gray-800'
                      }`}
                    >
                      {cell.day}
                    </div>
                    {/* 해당 날짜의 이벤트만 렌더링 */}
                    {cellEvents.map((e, idx) => (
                      <div
                        key={idx}
                        className={`mt-2 leading-loose ${cell.muted ? 'opacity-50' : ''}`}
                      >
                        <div className='text-[10px] font-normal text-green-500'>
                          {translateStatus(e.category)}
                        </div>
                        <div className='text-xs font-semibold text-black'>{e.title}</div>
                        <div className='mt-1 text-xs text-gray-300'>
                          {toYMDHM(e.startDate)} ~ {toYMDHM(e.endDate)}
                        </div>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
