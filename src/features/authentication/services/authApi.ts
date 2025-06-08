import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'
import type { ApiResponse } from '@/lib/types'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types'

/**
 * Kimlik doğrulama API fonksiyonları
 */
const authApi = {
  /**
   * Kullanıcıyı kimlik bilgileri ile doğrular
   * @param data - Giriş isteği verisi
   * @returns Kimlik doğrulama yanıtı ile Promise
   */
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  /**
   * Yeni bir kullanıcı hesabı kaydeder
   * @param data - Kayıt isteği verisi
   * @returns Kimlik doğrulama yanıtı ile Promise
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  /**
   * Mevcut kullanıcı profilini getirir
   * @returns Kullanıcı verisi ile Promise
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },
}

// TanStack Query Hooks

/**
 * Kullanıcı girişi için TanStack Query mutation hook'u
 * @returns Giriş işlemi için mutation nesnesi
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    mutationKey: ['auth', 'login'],
  })
}

/**
 * Kullanıcı kaydı için TanStack Query mutation hook'u
 * @returns Kayıt işlemi için mutation nesnesi
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    mutationKey: ['auth', 'register'],
  })
}

/**
 * Kullanıcı profili getirmek için TanStack Query hook'u
 * @returns Profil verisi için query nesnesi (varsayılan olarak devre dışı)
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: false, // Manuel olarak çağırılacak
  })
} 