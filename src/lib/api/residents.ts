import apiClient from './client';
import type {
  ResidentCreateRequest,
  ResidentDto,
  ResidentFindAllPageResponse,
  ResidentUpdateRequest,
  ResidentImportResponse,
  FindResidentsParams,
  ExportResidentsParams,
} from '@/lib/types';

/**
 * Resident Management API
 * Handles resident CRUD operations and CSV import/export
 * All endpoints require admin permission
 */

// ===================================================================
// Resident CRUD Operations
// ===================================================================

/**
 * Create a new resident
 * Requires admin permission
 *
 * @param data - Resident information (apartmentId, email, contact, name, building, unit, isHouseholder)
 * @returns Created resident information
 */
export const createResident = async (data: ResidentCreateRequest): Promise<ResidentDto> => {
  const response = await apiClient.post<ResidentDto>('/residents', data);
  return response.data;
};

/**
 * Get paginated list of residents
 * Requires admin permission
 *
 * @param params - Query parameters (page, limit, searchKeyword, building, unit, isHouseholder, isRegistered)
 * @returns Paginated resident list
 */
export const getResidents = async (params: FindResidentsParams): Promise<ResidentFindAllPageResponse> => {
  const response = await apiClient.get<ResidentFindAllPageResponse>('/residents', { params });
  return response.data;
};

/**
 * Get resident details by ID
 * Requires admin permission
 *
 * @param id - Resident ID
 * @returns Resident details
 */
export const getResident = async (id: string): Promise<ResidentDto> => {
  const response = await apiClient.get<ResidentDto>(`/residents/${id}`);
  return response.data;
};

/**
 * Update resident information
 * Requires admin permission
 *
 * @param id - Resident ID
 * @param data - Updated resident information
 */
export const updateResident = async (id: string, data: ResidentUpdateRequest): Promise<void> => {
  await apiClient.patch<void>(`/residents/${id}`, data);
};

/**
 * Delete resident
 * Requires admin permission
 *
 * @param id - Resident ID
 */
export const deleteResident = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/residents/${id}`);
};

// ===================================================================
// CSV File Management
// ===================================================================

/**
 * Download resident upload template (CSV)
 * Requires admin permission
 *
 * Returns a CSV file with headers for bulk resident upload.
 *
 * @returns Blob containing the CSV template file
 */
export const downloadResidentTemplate = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/residents/file/template', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Import residents from CSV file
 * Requires admin permission
 *
 * @param file - CSV file containing resident data
 * @returns Import result with count of created residents
 */
export const importResidentsFromFile = async (file: File): Promise<ResidentImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ResidentImportResponse>('/residents/file/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Export residents list to CSV file
 * Requires admin permission
 *
 * Downloads a CSV file containing filtered resident data.
 *
 * @param params - Filter parameters (searchKeyword, building, unit, isHouseholder, isRegistered)
 * @returns Blob containing the CSV file
 */
export const exportResidentsToFile = async (params: ExportResidentsParams): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/residents/file/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
