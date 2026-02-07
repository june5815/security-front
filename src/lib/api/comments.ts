import apiClient from './client';
import type {
  CommentDto,
  CommentFindAllPageResponse,
  CommentsCreateRequest,
  CommentsUpdateRequest,
  FindCommentsParams,
} from '@/lib/types';

// ===================================================================
// Comment CRUD Operations
// ===================================================================

/**
 * Create a new comment on a resource (notice or complaint)
 *
 * @param data - Comment creation data (resourceType, resourceId, content)
 * @returns Created comment data with author info
 */
export const createComment = async (
  data: CommentsCreateRequest,
): Promise<CommentDto> => {
  const response = await apiClient.post<CommentDto>('/comments', data);
  return response.data;
};

/**
 * Get paginated list of comments for a specific resource
 *
 * @param params - Query parameters (resourceType, resourceId, page, limit)
 * @returns Paginated list of comments with author info
 */
export const getComments = async (
  params: FindCommentsParams,
): Promise<CommentFindAllPageResponse> => {
  const response = await apiClient.get<CommentFindAllPageResponse>(
    '/comments',
    { params },
  );
  return response.data;
};

/**
 * Update comment content
 * Users can only update their own comments
 *
 * @param id - Comment ID
 * @param data - Updated comment data (content only)
 */
export const updateComment = async (
  id: string,
  data: CommentsUpdateRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/comments/${id}`, data);
};

/**
 * Delete a comment
 * Users can only delete their own comments
 *
 * @param id - Comment ID
 */
export const deleteComment = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/comments/${id}`);
};
