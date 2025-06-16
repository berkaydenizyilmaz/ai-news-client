import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logService } from '@/lib/log-service'
import type { ApiResponse } from '@/lib/types'

// Setting varlık arayüzü (API dokümantasyonuna uygun)
export interface Setting {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  category?: 'general' | 'rss' | 'ai' | 'auth' | 'news' | 'forum' | 'email' | 'security'
  updated_by?: string
  created_at: string
  updated_at: string
}

// Setting oluşturma isteği
export interface CreateSettingRequest {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  category?: 'general' | 'rss' | 'ai' | 'auth' | 'news' | 'forum' | 'email' | 'security'
}

// Setting güncelleme isteği
export interface UpdateSettingRequest {
  value?: string
  description?: string
}

// Settings sorgu parametreleri
export interface SettingsQuery {
  category?: string
  type?: string
  search?: string
}

// Toplu güncelleme isteği
export interface BulkUpdateRequest {
  settings: Array<{
    key: string
    value: string
  }>
}

// Settings API fonksiyonları
// Admin panelinde sistem ayarları yönetimi için kullanılır
const settingsApi = {
  // Tüm ayarları getirir (filtreleme ile)
  getSettings: async (params?: SettingsQuery): Promise<ApiResponse<Setting[]>> => {
    const response = await apiClient.get('/settings', { params })
    return response.data
  },

  // Belirli bir ayarı key'e göre getirir
  getSettingByKey: async (key: string): Promise<ApiResponse<Setting>> => {
    const response = await apiClient.get(`/settings/${key}`)
    return response.data
  },

  // Kategoriye göre ayarları getirir
  getSettingsByCategory: async (category: string): Promise<ApiResponse<Setting[]>> => {
    const response = await apiClient.get(`/settings/category/${category}`)
    return response.data
  },

  // Yeni ayar oluşturur
  createSetting: async (data: CreateSettingRequest): Promise<ApiResponse<Setting>> => {
    try {
      const response = await apiClient.post('/settings', data)
      
      // Başarılı oluşturma logu
      if (response.data.success) {
        await logService.info('settings', 'Yeni ayar oluşturuldu', {
          key: data.key,
          category: data.category,
          type: data.type
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız oluşturma logu
      await logService.error('settings', 'Ayar oluşturma başarısız', {
        key: data.key,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  // Ayarı günceller
  updateSetting: async (key: string, data: UpdateSettingRequest): Promise<ApiResponse<Setting>> => {
    try {
      const response = await apiClient.put(`/settings/${key}`, data)
      
      // Başarılı güncelleme logu
      if (response.data.success) {
        await logService.info('settings', 'Ayar güncellendi', {
          key,
          updated_fields: Object.keys(data).join(', ')
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız güncelleme logu
      await logService.error('settings', 'Ayar güncelleme başarısız', {
        key,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  // Ayarı siler
  deleteSetting: async (key: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/settings/${key}`)
      
      // Başarılı silme logu
      if (response.data.success) {
        await logService.info('settings', 'Ayar silindi', { key })
      }
      
      return response.data
    } catch (error) {
      // Başarısız silme logu
      await logService.error('settings', 'Ayar silme başarısız', {
        key,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },

  // Toplu güncelleme
  bulkUpdateSettings: async (data: BulkUpdateRequest): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.put('/settings/bulk', data)
      
      // Başarılı toplu güncelleme logu
      if (response.data.success) {
        await logService.info('settings', 'Toplu ayar güncellemesi yapıldı', {
          updated_count: data.settings.length,
          keys: data.settings.map(s => s.key).join(', ')
        })
      }
      
      return response.data
    } catch (error) {
      // Başarısız toplu güncelleme logu
      await logService.error('settings', 'Toplu ayar güncellemesi başarısız', {
        attempted_count: data.settings.length,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      })
      throw error
    }
  },
}

// Query Keys
export const settingsKeys = {
  all: ['admin', 'settings'] as const,
  lists: () => [...settingsKeys.all, 'list'] as const,
  list: (params?: SettingsQuery) => [...settingsKeys.lists(), params] as const,
  details: () => [...settingsKeys.all, 'detail'] as const,
  detail: (key: string) => [...settingsKeys.details(), key] as const,
  categories: () => [...settingsKeys.all, 'category'] as const,
  category: (category: string) => [...settingsKeys.categories(), category] as const,
}

// TanStack Query Hooks

// Tüm ayarları getirmek için TanStack Query hook'u
export const useSettings = (params?: SettingsQuery) => {
  return useQuery({
    queryKey: settingsKeys.list(params),
    queryFn: async (): Promise<Setting[]> => {
      const response = await settingsApi.getSettings(params)
      return response.data!
    },
    staleTime: 60000, // 1 dakika
  })
}

// Belirli bir ayarı getirmek için TanStack Query hook'u
export const useSetting = (key: string) => {
  return useQuery({
    queryKey: settingsKeys.detail(key),
    queryFn: async (): Promise<Setting> => {
      const response = await settingsApi.getSettingByKey(key)
      return response.data!
    },
    enabled: !!key,
  })
}

// Kategoriye göre ayarları getirmek için TanStack Query hook'u
export const useSettingsByCategory = (category: string) => {
  return useQuery({
    queryKey: settingsKeys.category(category),
    queryFn: async (): Promise<Setting[]> => {
      const response = await settingsApi.getSettingsByCategory(category)
      return response.data!
    },
    enabled: !!category,
  })
}

// Yeni ayar oluşturmak için TanStack Query mutation hook'u
export const useCreateSetting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSettingRequest): Promise<Setting> => {
      const response = await settingsApi.createSetting(data)
      return response.data!
    },
    mutationKey: ['admin', 'settings', 'create'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() })
    },
  })
}

// Ayar güncellemek için TanStack Query mutation hook'u
export const useUpdateSetting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ key, data }: { key: string; data: UpdateSettingRequest }): Promise<Setting> => {
      const response = await settingsApi.updateSetting(key, data)
      return response.data!
    },
    mutationKey: ['admin', 'settings', 'update'],
    onSuccess: (data, variables) => {
      queryClient.setQueryData(settingsKeys.detail(variables.key), { success: true, data })
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() })
    },
  })
}

// Ayar silmek için TanStack Query mutation hook'u
export const useDeleteSetting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: settingsApi.deleteSetting,
    mutationKey: ['admin', 'settings', 'delete'],
    onSuccess: (_, key) => {
      queryClient.removeQueries({ queryKey: settingsKeys.detail(key) })
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() })
    },
  })
}

// Toplu güncelleme için TanStack Query mutation hook'u
export const useBulkUpdateSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: settingsApi.bulkUpdateSettings,
    mutationKey: ['admin', 'settings', 'bulk-update'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
    },
  })
} 