import apiClient from "./client";
import type {
  ComplaintFindAllPageResponse,
  ComplaintsCreateRequest,
  ComplaintsDto,
  ComplaintsUpdateRequest,
  ComplaintStatusUpdateRequest,
  FindComplaintsParams,
} from "@/lib/types";

// ===================================================================
// Complaint CRUD Operations
// ===================================================================

/**
 * Create a new complaint
 *
 * @param data - Complaint creation data
 * @returns Created complaint data
 */
export const createComplaint = async (
  data: ComplaintsCreateRequest,
): Promise<ComplaintsDto> => {
  const response = await apiClient.post<ComplaintsDto>("/complaints", data);
  return response.data;
};

/**
 * Get paginated list of complaints with optional filters
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated complaint list
 */
export const getComplaints = async (
  params: FindComplaintsParams,
): Promise<ComplaintFindAllPageResponse> => {
  // undefined와 null, 빈 문자열 값을 제거하되, false는 유효한 값이므로 유지
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      if (typeof value === "boolean") return true; // false도 유효한 값
      return value !== undefined && value !== null && value !== "";
    }),
  );

  const response = await apiClient.get<ComplaintFindAllPageResponse>(
    "/complaints",
    { params: cleanParams },
  );
  return response.data;
};

/**
 * Get complaint details by ID
 *
 * @param id - Complaint ID
 * @returns Complaint details
 */
export const getComplaint = async (id: string): Promise<ComplaintsDto> => {
  const response = await apiClient.get<ComplaintsDto>(`/complaints/${id}`);
  return response.data;
};

/**
 * Update complaint information
 *
 * @param id - Complaint ID
 * @param data - Updated complaint data
 */
export const updateComplaint = async (
  id: string,
  data: ComplaintsUpdateRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/complaints/${id}`, data);
};

/**
 * Delete a complaint
 *
 * @param id - Complaint ID
 */
export const deleteComplaint = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/complaints/${id}`);
};

// ===================================================================
// Admin Status Management
// ===================================================================

/**
 * Update complaint status
 * [Admin Only]
 *
 * @param id - Complaint ID
 * @param data - Status update data
 */
export const updateComplaintStatus = async (
  id: string,
  data: ComplaintStatusUpdateRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/complaints/${id}/status`, data);
};
