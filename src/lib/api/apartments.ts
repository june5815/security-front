import apiClient from './client';
import type { FindApartmentsParams, ApartmentFindAllPageResponse, ApartmentsDto } from '@/lib/types';

/**
 * Apartment API
 * Handles apartment listing and details
 */

/**
 * Get paginated list of apartments
 * Public endpoint - no authentication required
 *
 * @param params - Query parameters (page, limit, searchKeyword)
 * @returns Paginated apartment list
 */
export const getApartments = async (params: FindApartmentsParams): Promise<ApartmentFindAllPageResponse> => {
  const response = await apiClient.get<ApartmentFindAllPageResponse>('/apartments', { params });
  return response.data;
};

/**
 * Get apartment details by ID
 *
 * @param id - Apartment ID
 * @returns Apartment details including buildings, units, description, etc.
 */
export const getApartment = async (id: string): Promise<ApartmentsDto> => {
  const response = await apiClient.get<ApartmentsDto>(`/apartments/${id}`);
  return response.data;
};
