import { useAuthStore } from '@/store/auth-store'
import {
  useSettings,
  useSetting,
  useSettingsByCategory,
  useCreateSetting,
  useUpdateSetting,
  useDeleteSetting,
  useBulkUpdateSettings,
} from '../services/settings-api'
import type { CreateSettingRequest, UpdateSettingRequest, BulkUpdateRequest } from '../services/settings-api'

/**
 * Settings yönetimi için merkezi hook
 * Admin yetki kontrolü ve helper fonksiyonlar sağlar
 */
export const useSettingsManager = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  // Admin mutations
  const createSetting = useCreateSetting()
  const updateSetting = useUpdateSetting()
  const deleteSetting = useDeleteSetting()
  const bulkUpdateSettings = useBulkUpdateSettings()

  // Helper functions with admin checks
  const handleCreateSetting = async (data: CreateSettingRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir')
    }
    return createSetting.mutateAsync(data)
  }

  const handleUpdateSetting = async (key: string, data: UpdateSettingRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir')
    }
    return updateSetting.mutateAsync({ key, data })
  }

  const handleDeleteSetting = async (key: string) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir')
    }
    return deleteSetting.mutateAsync(key)
  }

  const handleBulkUpdate = async (data: BulkUpdateRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir')
    }
    return bulkUpdateSettings.mutateAsync(data)
  }

  return {
    // Hook functions for queries (to be used directly in components)
    useSettings,
    useSetting,
    useSettingsByCategory,
    
    // Mutations with admin checks
    createSetting: {
      ...createSetting,
      mutateAsync: handleCreateSetting,
    },
    updateSetting: {
      ...updateSetting,
      mutateAsync: handleUpdateSetting,
    },
    deleteSetting: {
      ...deleteSetting,
      mutateAsync: handleDeleteSetting,
    },
    bulkUpdateSettings: {
      ...bulkUpdateSettings,
      mutateAsync: handleBulkUpdate,
    },
    
    // Utils
    isAdmin,
  }
} 