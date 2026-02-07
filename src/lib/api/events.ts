import apiClient from './client';
import type { FindEventsParams, EventDto } from '@/lib/types';

/**
 * Events API
 * Handles event retrieval for apartments (NOTICE, POLL types)
 */

/**
 * 이벤트 목록 조회
 * GET /events
 *
 * 연도와 월 기준으로 아파트의 이벤트(NOTICE, POLL)를 조회합니다.
 *
 * @param params - 쿼리 파라미터 (apartmentId, year, month - 모두 필수)
 * @param params.apartmentId - 아파트 ID
 * @param params.year - 연도
 * @param params.month - 월 (1-12)
 * @returns 이벤트 목록 배열
 *
 * @example
 * ```ts
 * // 2025년 6월의 이벤트 조회
 * const events = await getEvents({
 *   apartmentId: 'apt-uuid-123',
 *   year: 2025,
 *   month: 6
 * });
 * console.log(events); // EventDto[]
 * ```
 */
export const getEvents = async (params: FindEventsParams): Promise<EventDto[]> => {
  const response = await apiClient.get<EventDto[]>('/events', { params });
  return response.data;
};
