// ==================== GLOBAL API TYPES ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

// ==================== ERROR TYPES ====================
export interface ApiError extends Error {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
} 