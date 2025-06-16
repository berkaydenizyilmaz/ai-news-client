import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logService } from '@/lib/log-service'
import type { ApiResponse } from '@/lib/types'
import type { 
  UserWithStats,
  UsersListResponse,
  UsersStatistics,
  GetUsersQuery,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest
} from '../types'

// Users API fonksiyonları
// Admin panelinde kullanıcı yönetimi için kullanılır
const usersApi = {
  /**
   * Kullanıcı istatistiklerini getirir
   */
  getStatistics: async (): Promise<ApiResponse<UsersStatistics>> => {
    try {
      const response = await apiClient.get('/users/statistics')
      
      await logService.info('users', 'Kullanıcı istatistikleri görüntülendi', {
        action: 'view_statistics'
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı istatistikleri getirme hatası', {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Kullanıcı listesini pagination ve filtreleme ile getirir
   */
  getUsers: async (params?: GetUsersQuery): Promise<ApiResponse<UsersListResponse>> => {
    try {
      const response = await apiClient.get('/users', { params })
      
      await logService.info('users', 'Kullanıcı listesi görüntülendi', {
        action: 'view_list',
        filters: params ? Object.keys(params).join(', ') : 'none'
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı listesi getirme hatası', {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Belirli bir kullanıcının detayını getirir
   */
  getUserById: async (id: string): Promise<ApiResponse<UserWithStats>> => {
    try {
      const response = await apiClient.get(`/users/${id}`)
      
      await logService.info('users', 'Kullanıcı detayı görüntülendi', {
        action: 'view_detail',
        user_id: id
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı detayı getirme hatası', {
        user_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Kullanıcı bilgilerini günceller
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<UserWithStats>> => {
    try {
      const response = await apiClient.put(`/users/${id}`, data)
      
      await logService.info('users', 'Kullanıcı bilgileri güncellendi', {
        action: 'update_user',
        user_id: id,
        updated_fields: Object.keys(data).join(', ')
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı güncelleme hatası', {
        user_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Kullanıcının rolünü günceller
   */
  updateUserRole: async (id: string, data: UpdateUserRoleRequest): Promise<ApiResponse<UserWithStats>> => {
    try {
      const response = await apiClient.put(`/users/${id}/role`, data)
      
      await logService.info('users', 'Kullanıcı rolü güncellendi', {
        action: 'update_role',
        user_id: id,
        new_role: data.role
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı rol güncelleme hatası', {
        user_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Kullanıcının aktiflik durumunu günceller
   */
  updateUserStatus: async (id: string, data: UpdateUserStatusRequest): Promise<ApiResponse<UserWithStats>> => {
    try {
      const response = await apiClient.put(`/users/${id}/status`, data)
      
      await logService.info('users', 'Kullanıcı durumu güncellendi', {
        action: 'update_status',
        user_id: id,
        new_status: data.is_active ? 'active' : 'inactive'
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı durum güncelleme hatası', {
        user_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  /**
   * Kullanıcıyı siler (soft delete)
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/users/${id}`)
      
      await logService.info('users', 'Kullanıcı silindi', {
        action: 'delete_user',
        user_id: id
      })
      
      return response.data
    } catch (error) {
      await logService.error('users', 'Kullanıcı silme hatası', {
        user_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },
}

// TanStack Query Hooks

/**
 * Kullanıcı istatistiklerini getirmek için TanStack Query hook'u
 */
export const useUsersStatistics = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'statistics'],
    queryFn: usersApi.getStatistics,
    staleTime: 60000, // 1 dakika
  })
}

/**
 * Kullanıcı listesi getirmek için TanStack Query hook'u
 */
export const useUsers = (params?: GetUsersQuery) => {
  return useQuery({
    queryKey: ['admin', 'users', 'list', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 30000, // 30 saniye
  })
}

/**
 * Belirli bir kullanıcı getirmek için TanStack Query hook'u
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', 'detail', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  })
}

/**
 * Kullanıcı güncellemek için TanStack Query mutation hook'u
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => 
      usersApi.updateUser(id, data),
    onSuccess: () => {
      // Kullanıcı listesini ve istatistikleri yenile
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'statistics'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail'] })
    },
  })
}

/**
 * Kullanıcı rolü güncellemek için TanStack Query mutation hook'u
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleRequest }) => 
      usersApi.updateUserRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

/**
 * Kullanıcı durumu güncellemek için TanStack Query mutation hook'u
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusRequest }) => 
      usersApi.updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

/**
 * Kullanıcı silmek için TanStack Query mutation hook'u
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
} 