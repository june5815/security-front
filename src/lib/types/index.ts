/**
 * Single Source of Truth for all type imports
 *
 * RULE: ONLY import types from '@/lib/types'
 * NEVER import from '@/lib/types/api' directly
 */

import type { components, operations } from './api';

// ===================================================================
// Re-export base types for advanced usage
// ===================================================================
export type { components, operations };

// ===================================================================
// Auth & Session Types
// ===================================================================
export type LoginRequest = components['schemas']['LoginRequest'];
export type LoginResponse = components['schemas']['LoginResponse'];

// ===================================================================
// User Management Types
// ===================================================================

// Super Admin
export type SuperAdminSignupRequest = components['schemas']['SuperAdminSignupRequest'];

// Admin User
export type AdminSignupRequest = components['schemas']['AdminSignupRequest'];
export type AdminSignupRequestAdminOf = components['schemas']['AdminSignupRequest$AdminOf'];
export type AdminUserDto = components['schemas']['AdminUserDto'];
export type AdminUserDtoAdminOf = components['schemas']['AdminUserDto$AdminOf'];
export type AdminUserUpdateRequest = components['schemas']['AdminUserUpdateRequest'];
export type AdminUserUpdateRequestAdminOf = components['schemas']['AdminUserUpdateRequest$AdminOf'];
export type AdminFindAllPageResponse = components['schemas']['AdminFindAllPageResponse'];

// Resident User
export type ResidentSignupRequest = components['schemas']['ResidentSignupRequest'];
export type ResidentUserDto = components['schemas']['ResidentUserDto'];
export type ResidentUserFindAllPageResponse = components['schemas']['ResidentUserFindAllPageResponse'];

// User Common
export type UpdateJoinStatusRequest = components['schemas']['UpdateJoinStatusRequest'];
export type UserAvatarUpdateRequest = components['schemas']['UserAvatarUpdateRequest'];
export type UserPasswordUpdateRequest = components['schemas']['UserPasswordUpdateRequest'];

// ===================================================================
// Resident Management Types
// ===================================================================
export type ResidentDto = components['schemas']['ResidentDto'];
export type ResidentCreateRequest = components['schemas']['ResidentCreateRequest'];
export type ResidentUpdateRequest = components['schemas']['ResidentUpdateRequest'];
export type ResidentFindAllPageResponse = components['schemas']['ResidentFindAllPageResponse'];
export type ResidentImportResponse = components['schemas']['ResidentImportResponse'];

// ===================================================================
// Apartment Types
// ===================================================================
export type ApartmentsDto = components['schemas']['ApartmentsDto'];
export type ApartmentFindAllPageResponse = components['schemas']['ApartmentFindAllPageResponse'];

// ===================================================================
// Notice Types
// ===================================================================
export type NoticeDto = components['schemas']['NoticeDto'];
export type NoticeDetailDto = components['schemas']['NoticeDetailDto'];
export type NoticeCreateRequest = components['schemas']['NoticeCreateRequest'];
export type NoticeUpdateRequest = components['schemas']['NoticeUpdateRequest'];
export type NoticeFindAllPageResponse = components['schemas']['NoticeFindAllPageResponse'];

// ===================================================================
// Event Types
// ===================================================================
export type EventDto = components['schemas']['EventDto'];

// ===================================================================
// Complaint Types
// ===================================================================
export type ComplaintsDto = components['schemas']['ComplaintsDto'];
export type ComplaintsCreateRequest = components['schemas']['ComplaintsCreateRequest'];
export type ComplaintsUpdateRequest = components['schemas']['ComplaintsUpdateRequest'];
export type ComplaintStatusUpdateRequest = components['schemas']['ComplaintStatusUpdateRequest'];
export type ComplaintFindAllPageResponse = components['schemas']['ComplaintFindAllPageResponse'];

// ===================================================================
// Poll Types
// ===================================================================
export type PollDto = components['schemas']['PollDto'];
export type PollDetailDto = components['schemas']['PollDetailDto'];
export type PollCreateRequest = components['schemas']['PollCreateRequest'];
export type PollUpdateRequest = components['schemas']['PollUpdateRequest'];
export type PollFindAllPageResponse = components['schemas']['PollFindAllPageResponse'];

// ===================================================================
// Comment Types
// ===================================================================
export type CommentDto = components['schemas']['CommentDto'];
export type CommentsCreateRequest = components['schemas']['CommentsCreateRequest'];
export type CommentsUpdateRequest = components['schemas']['CommentsUpdateRequest'];
export type CommentFindAllPageResponse = components['schemas']['CommentFindAllPageResponse'];

// ===================================================================
// Notification Types
// ===================================================================
export type NotificationDto = components['schemas']['NotificationDto'];
export type NotificationFindAllPageResponse = components['schemas']['NotificationFindAllPageResponse'];

// ===================================================================
// Query Parameter Types - Extracted from operations
// ===================================================================

// Auth
// (no query params for auth endpoints)

// Users
export type FindAdminsParams = operations['UsersController_findAllAdmin']['parameters']['query'];
export type FindResidentUsersParams = operations['UsersController_findAllResidentUsers']['parameters']['query'];

// Residents
export type FindResidentsParams = operations['ResidentsController_findAllResidents']['parameters']['query'];
export type ExportResidentsParams = operations['ResidentsController_exportResidentsFile']['parameters']['query'];

// Apartments
export type FindApartmentsParams = operations['ApartmentsController_findAll']['parameters']['query'];

// Notices
export type FindNoticesParams = operations['NoticesController_findAll']['parameters']['query'];

// Events
export type FindEventsParams = operations['EventsController_findAll']['parameters']['query'];

// Complaints
export type FindComplaintsParams = operations['ComplaintsController_findAll']['parameters']['query'];

// Polls
export type FindPollsParams = operations['PollsController_findAll']['parameters']['query'];

// Comments
export type FindCommentsParams = operations['CommentsController_findAll']['parameters']['query'];

// Notifications
export type FindNotificationsParams = operations['NotificationsController_findAll']['parameters']['query'];

// ===================================================================
// Enum/Union Types - Extracted from schema properties
// ===================================================================

// User Roles & Status
export type UserRole = LoginResponse['role'];
export type JoinStatus = LoginResponse['joinStatus'];

// Notice
export type NoticeCategory = NoticeDto['category'];

// Complaint
export type ComplaintStatus = ComplaintsDto['status'];

// Poll
export type PollStatus = PollDto['status'];

// Event
export type EventResourceType = EventDto['resourceType'];

// Comment
export type CommentResourceType = CommentsCreateRequest['resourceType'];

// Resident
export type ResidentIsHouseholder = ResidentDto['isHouseholder'];

// ===================================================================
// Utility Types
// ===================================================================

// Pagination
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PageResponse<T> = {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  hasNext: boolean;
};

// Error response type
export type ErrorResponse = {
  message: string;
  statusCode: number;
  error?: string;
};
