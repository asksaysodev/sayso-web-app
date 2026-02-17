/**
 * Common API type definitions
 */

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Error response
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// Request configuration with retry tracking
export interface ApiRequestConfig {
  _retryCount?: number;
  _retry?: boolean;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Upload response
export interface UploadResponse {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

// Batch operation response
export interface BatchResponse<T> {
  successful: T[];
  failed: BatchError[];
  totalProcessed: number;
}

export interface BatchError {
  index: number;
  item: unknown;
  error: string;
}

// WebSocket message types
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface WebSocketError {
  code: number;
  reason: string;
}

// Supabase-specific types (commonly used with your API)
export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Re-export for convenience
export type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
