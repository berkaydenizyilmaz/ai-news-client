// ==================== AUTH TYPES ====================
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'visitor' | 'user' | 'moderator' | 'admin';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// ==================== SETTINGS TYPES ====================
export interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  category?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// ==================== RSS TYPES ====================
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RssSource {
  id: string;
  name: string;
  url: string;
  description?: string;
  category_id?: string;
  is_active: boolean;
  last_fetched_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: NewsCategory;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_prev: boolean;
} 