import apiClient from './client';
import type {
  NotificationFindAllPageResponse,
  FindNotificationsParams,
} from '@/lib/types';

/**
 * 알림 목록 조회
 * GET /notifications
 *
 * @param params - 페이지네이션 파라미터 (page, limit)
 * @returns 알림 목록 페이지 응답
 *
 * @example
 * ```ts
 * const notifications = await getNotifications({ page: 1, limit: 20 });
 * console.log(notifications.data); // NotificationDto[]
 * ```
 */
export const getNotifications = async (params: FindNotificationsParams): Promise<NotificationFindAllPageResponse> => {
  const response = await apiClient.get<NotificationFindAllPageResponse>('/notifications', {
    params,
  });
  return response.data;
};

/**
 * 알림 읽음 처리
 * PATCH /notifications/{notificationId}/read
 *
 * @param notificationId - 읽음 처리할 알림의 UUID
 * @returns void (204 No Content)
 *
 * @example
 * ```ts
 * await markNotificationAsRead('uuid-1234');
 * ```
 */
export const markNotificationAsRead = async (notificationId: string) => {
  await apiClient.patch<void>(`/notifications/${notificationId}/read`);
};
