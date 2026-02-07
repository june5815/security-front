import apiClient from './client';
import {
  FindNoticesParams,
  NoticeCreateRequest, NoticeDetailDto,
  NoticeDto,
  NoticeFindAllPageResponse,
  NoticeUpdateRequest,
} from '@/lib/types';

// ===================================================================
// Notice CRUD Operations
// ===================================================================

/**
 * Create a new notice
 * [Admin Only]
 *
 * @param data - Notice creation data (includes optional event dates)
 * @returns Created notice data
 */
export const createNotice = async (
  data: NoticeCreateRequest,
): Promise<NoticeDto> => {
  const response = await apiClient.post<NoticeDto>('/notices', data);
  return response.data;
};

/**
 * Get paginated list of notices with optional filters
 *
 * @param params - Query parameters (page, limit, category, searchKeyword)
 * @returns Paginated notice list
 */
export const getNotices = async (
  params: FindNoticesParams,
): Promise<NoticeFindAllPageResponse> => {
  const response = await apiClient.get<NoticeFindAllPageResponse>(
    '/notices',
    { params },
  );
  return response.data;
};

/**
 * Get notice details by ID
 *
 * @param id - Notice ID
 * @returns Notice details including view count, comment count, and author info
 */
export const getNotice = async (id: string): Promise<NoticeDetailDto> => {
  const response = await apiClient.get<NoticeDto>(`/notices/${id}`);
  return response.data;
};

/**
 * Update notice information
 * [Admin Only]
 *
 * @param id - Notice ID
 * @param data - Updated notice data (all fields optional)
 */
export const updateNotice = async (
  id: string,
  data: NoticeUpdateRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/notices/${id}`, data);
};

/**
 * Delete a notice
 * [Admin Only]
 *
 * @param id - Notice ID
 */
export const deleteNotice = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/notices/${id}`);
};
