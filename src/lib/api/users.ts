import apiClient from './client';
import type {
  SuperAdminSignupRequest,
  AdminSignupRequest,
  ResidentSignupRequest,
  FindAdminsParams,
  AdminFindAllPageResponse,
  FindResidentUsersParams,
  ResidentUserFindAllPageResponse,
  AdminUserUpdateRequest,
  UpdateJoinStatusRequest,
  UserPasswordUpdateRequest,
} from '@/lib/types';

/**
 * User Management API
 * Handles user signup, admin/resident management, and profile updates
 */

// ===================================================================
// User Signup
// ===================================================================

/**
 * Create a new super admin account
 *
 * @param data - Super admin signup information
 */
export const createSuperAdminUser = async (data: SuperAdminSignupRequest): Promise<void> => {
  await apiClient.post<void>('/users/super-admins', data);
};

/**
 * Create a new admin account
 *
 * @param data - Admin signup information (includes apartment data)
 */
export const createAdminUser = async (data: AdminSignupRequest) => {
  return await apiClient.post<any>('/users/admins', data);
};

/**
 * Create a new resident account
 *
 * @param data - Resident signup information
 */
export const createResidentUser = async (data: ResidentSignupRequest): Promise<void> => {
  await apiClient.post<void>('/users/residents', data);
};

// ===================================================================
// Admin User Management
// ===================================================================

/**
 * Get paginated list of admin users
 * Requires super admin permission
 *
 * @param params - Query parameters (page, limit, joinStatus, searchKeyword)
 * @returns Paginated admin user list
 */
export const getAdminUsers = async (params: FindAdminsParams): Promise<AdminFindAllPageResponse> => {
  const response = await apiClient.get<AdminFindAllPageResponse>('/users/admins', { params });
  return response.data;
};

/**
 * Update admin user information (including apartment info)
 * Requires super admin permission
 *
 * @param id - Admin user ID
 * @param data - Updated admin information
 */
export const updateAdminUser = async (id: string, data: AdminUserUpdateRequest): Promise<void> => {
  await apiClient.patch<void>(`/users/admins/${id}`, data);
};

/**
 * Delete admin user account
 * Requires super admin permission
 *
 * @param id - Admin user ID
 */
export const deleteAdminUser = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/users/admins/${id}`);
};

/**
 * Update join status for multiple admin users (batch operation)
 * Requires super admin permission
 *
 * @param data - Join status to apply (APPROVED or REJECTED)
 */
export const updateAdminUsersBatchJoinStatus = async (data: UpdateJoinStatusRequest): Promise<void> => {
  await apiClient.patch<void>('/users/admins/join-status', data);
};

/**
 * Update join status for a single admin user
 * Requires super admin permission
 *
 * @param id - Admin user ID
 * @param data - Join status to apply (APPROVED or REJECTED)
 */
export const updateAdminUserJoinStatus = async (id: string, data: UpdateJoinStatusRequest): Promise<void> => {
  await apiClient.patch<void>(`/users/admins/${id}/join-status`, data);
};

/**
 * Delete all rejected admin users (including apartment info)
 * Requires super admin permission
 */
export const deleteRejectedAdminUsers = async () => {
  return await apiClient.delete<any>('/users/admins/rejected');
};

// ===================================================================
// Resident User Management
// ===================================================================

/**
 * Get paginated list of resident users
 * Requires admin permission
 *
 * @param params - Query parameters (page, limit, joinStatus, searchKeyword, building, unit)
 * @returns Paginated resident user list
 */
export const getResidentUsers = async (params: FindResidentUsersParams): Promise<ResidentUserFindAllPageResponse> => {
  const response = await apiClient.get<ResidentUserFindAllPageResponse>('/users/residents', {
    params,
  });
  return response.data;
};

/**
 * Update join status for multiple resident users (batch operation)
 * Requires admin permission
 *
 * @param data - Join status to apply (APPROVED or REJECTED)
 */
export const updateResidentUsersBatchJoinStatus = async (data: UpdateJoinStatusRequest): Promise<void> => {
  await apiClient.patch<void>('/users/residents/join-status', data);
};

/**
 * Update join status for a single resident user
 * Requires admin permission
 *
 * @param id - Resident user ID
 * @param data - Join status to apply (APPROVED or REJECTED)
 */
export const updateResidentUserJoinStatus = async (id: string, data: UpdateJoinStatusRequest): Promise<void> => {
  await apiClient.patch<void>(`/users/residents/${id}/join-status`, data);
};

/**
 * Delete all rejected resident users
 * Requires admin permission
 */
export const deleteRejectedResidentUsers = async (): Promise<void> => {
  await apiClient.delete<void>('/users/residents/rejected');
};

// ===================================================================
// My Profile Management
// ===================================================================

/**
 * Update user profile avatar image
 *
 * @param file - Avatar image file
 */
export const updateMyAvatar = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('avatarImage', file);

  await apiClient.patch<void>('/users/me/avatar', formData);
};

/**
 * Change user password
 *
 * @param data - Current password and new password
 */
export const updateMyPassword = async (data: UserPasswordUpdateRequest): Promise<void> => {
  await apiClient.patch<void>('/users/me/password', data);
};
