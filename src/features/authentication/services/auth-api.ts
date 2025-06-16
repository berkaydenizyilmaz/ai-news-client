import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logService } from '@/lib/log-service'
import type { ApiResponse } from '@/lib/types'
import type { LoginRequest, RegisterRequest, AuthResponse, User, UpdateProfileRequest, ChangePasswordRequest } from '../types'

// Kimlik doğrulama API fonksiyonları
const authApi = {
  // Kullanıcıyı kimlik bilgileri ile doğrular
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

  // Yeni bir kullanıcı hesabı kaydeder
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

  // Mevcut kullanıcı profilini getirir
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  // Kullanıcı profilini günceller
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put('/auth/profile', data)
      
      // Başarılı profil güncelleme logu
      if (response.data.success) {
        await logService.info('auth', 'Kullanıcı profili güncellendi', {
          user_id: response.data.data?.id,
          updated_fields: Object.keys(data).join(', ')
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız profil güncelleme logu
      await logService.error('auth', 'Profil güncelleme başarısız', {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  // Kullanıcı şifresini değiştirir
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.put('/auth/change-password', data)
      
      // Başarılı şifre değiştirme logu
      if (response.data.success) {
        await logService.info('auth', 'Kullanıcı şifresi değiştirildi', {
          action: 'password_change'
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız şifre değiştirme logu
      await logService.error('auth', 'Şifre değiştirme başarısız', {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },
}

// TanStack Query Hooks

// Kullanıcı girişi için TanStack Query mutation hook'u
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    mutationKey: ['auth', 'login'],
  })
}

// Kullanıcı kaydı için TanStack Query mutation hook'u
export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    mutationKey: ['auth', 'register'],
  })
}

// Kullanıcı profili getirmek için TanStack Query hook'u
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: false, // Manuel olarak çağırılacak
  })
}

// Kullanıcı profili güncellemek için TanStack Query mutation hook'u
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authApi.updateProfile,
    mutationKey: ['auth', 'update-profile'],
  })
}

// Kullanıcı şifresi değiştirmek için TanStack Query mutation hook'u
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    mutationKey: ['auth', 'change-password'],
  })
} 