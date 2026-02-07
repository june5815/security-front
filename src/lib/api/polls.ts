import apiClient from './client';
import type {
  FindPollsParams,
  PollCreateRequest, PollDetailDto,
  PollDto,
  PollFindAllPageResponse,
  PollUpdateRequest,
} from '@/lib/types';

// ===================================================================
// Poll CRUD Operations
// ===================================================================

/**
 * Create a new poll
 * [Admin Only]
 *
 * @param data - Poll creation data including options
 * @returns Created poll data
 */
export const createPoll = async (
  data: PollCreateRequest,
): Promise<PollDto> => {
  const response = await apiClient.post<PollDto>('/polls', data);
  return response.data;
};

/**
 * Get paginated list of polls with optional filters
 *
 * Filters:
 * - status: Filter by poll status (PENDING, IN_PROGRESS, CLOSED)
 * - building: Filter by building number
 * - searchKeyword: Search in title/content
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated poll list
 */
export const getPolls = async (
  params: FindPollsParams,
): Promise<PollFindAllPageResponse> => {
  const response = await apiClient.get<PollFindAllPageResponse>('/polls', {
    params,
  });
  return response.data;
};

/**
 * Get poll details by ID
 *
 * @param id - Poll ID
 * @returns Poll details including options and author info
 */
export const getPoll = async (id: string): Promise<PollDetailDto> => {
  const response = await apiClient.get<PollDetailDto>(`/polls/${id}`);
  return response.data;
};

/**
 * Update poll information
 * [Admin Only]
 *
 * Note: When updating options, include existing option IDs
 *
 * @param id - Poll ID
 * @param data - Updated poll data
 */
export const updatePoll = async (
  id: string,
  data: PollUpdateRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/polls/${id}`, data);
};

/**
 * Delete a poll
 * [Admin Only]
 *
 * @param id - Poll ID
 */
export const deletePoll = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/polls/${id}`);
};

// ===================================================================
// Voting Operations
// ===================================================================

/**
 * Cast a vote for a poll option
 *
 * User can only vote once per poll. Voting for a different option
 * will automatically change the vote.
 *
 * @param pollId - Poll ID
 * @param optionId - Poll option ID
 */
export const vote = async (pollId: string, optionId: string): Promise<void> => {
  await apiClient.post<void>(`/polls/${pollId}/options/${optionId}/vote`);
};

/**
 * Cancel vote on a poll
 *
 * Removes the user's vote from the poll entirely.
 *
 * @param pollId - Poll ID
 * @param optionId - Poll option ID (the option the user voted for)
 */
export const cancelVote = async (
  pollId: string,
  optionId: string,
): Promise<void> => {
  await apiClient.delete<void>(
    `/polls/${pollId}/options/${optionId}/vote`,
  );
};
