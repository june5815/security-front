import apiClient from './client';
import type { LoginRequest, LoginResponse } from '@/lib/types';

/**
 * Authentication API
 * Handles login, logout, and token refresh operations
 */

/**
 * Login user and receive authentication tokens via HttpOnly cookies
 *
 * @param data - Login credentials (username, password)
 * @returns User information and session data
 *
 * Sets cookies:
 * - access_token (15 minutes)
 * - refresh_token (7 days)
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

/**
 * Logout user and clear authentication cookies
 *
 * Clears cookies:
 * - access_token
 * - refresh_token
 */
export const logout = async (): Promise<void> => {
  await apiClient.post<void>('/auth/logout');
};

/**
 * Refresh authentication tokens
 *
 * Requires refresh_token cookie to be present.
 * Issues new access_token and refresh_token via HttpOnly cookies.
 *
 * Note: This is typically called automatically by the axios interceptor
 * when a 401 error is encountered.
 */
export const refreshToken = async (): Promise<void> => {
  await apiClient.post<void>('/auth/refresh');
};
