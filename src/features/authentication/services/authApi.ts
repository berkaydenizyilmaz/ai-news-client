import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'
import { logService } from '@/lib/logService'
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
    try {
      const response = await apiClient.post('/auth/login', data)
      
      // Başarılı giriş logu
      if (response.data.success) {
        await logService.info('auth', 'Kullanıcı başarıyla giriş yaptı', {
          email: data.email,
          user_id: response.data.data?.user.id,
          login_method: 'email'
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız giriş logu
      await logService.error('auth', 'Kullanıcı girişi başarısız', {
        email: data.email,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Yeni bir kullanıcı hesabı kaydeder
   * @param data - Kayıt isteği verisi
   * @returns Kimlik doğrulama yanıtı ile Promise
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post('/auth/register', data)
      
      // Başarılı kayıt logu
      if (response.data.success) {
        await logService.info('auth', 'Yeni kullanıcı kaydı oluşturuldu', {
          email: data.email,
          username: data.username,
          user_id: response.data.data?.user.id,
          registration_method: 'email'
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız kayıt logu
      await logService.error('auth', 'Kullanıcı kaydı başarısız', {
        email: data.email,
        username: data.username,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
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