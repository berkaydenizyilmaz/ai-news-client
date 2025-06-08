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