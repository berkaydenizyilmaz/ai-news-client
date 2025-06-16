import { 
  useUsers,
  useUsersStatistics,
  useUser,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useDeleteUser
} from '../services/users-api'
import { useToast } from '@/hooks/use-toast'
import { useErrorHandler } from '@/hooks/use-error-handler'
import type { 
  GetUsersQuery,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest
} from '../types'

// Kullanıcı yönetimi için wrapper hook
// Admin kontrollerini ve toast mesajlarını içerir
export const useUsersManager = () => {
  const toast = useToast()
  const { handleError } = useErrorHandler()

  // Mutations
  const updateUserMutation = useUpdateUser()
  const updateUserRoleMutation = useUpdateUserRole()
  const updateUserStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  // Kullanıcı güncelleme
  const updateUser = {
    mutateAsync: async (id: string, data: UpdateUserRequest) => {
      try {
        const result = await updateUserMutation.mutateAsync({ id, data })
        toast.success('Kullanıcı güncellendi', `Kullanıcı bilgileri başarıyla güncellendi.`)
        return result
      } catch (error) {
        const errorMessage = handleError(error)
        toast.error('Güncelleme hatası', errorMessage)
        throw error
      }
    },
    isPending: updateUserMutation.isPending,
  }

  // Kullanıcı rolü güncelleme
  const updateUserRole = {
    mutateAsync: async (id: string, data: UpdateUserRoleRequest) => {
      try {
        const result = await updateUserRoleMutation.mutateAsync({ id, data })
        toast.success('Rol güncellendi', `Kullanıcı rolü ${data.role} olarak değiştirildi.`)
        return result
      } catch (error) {
        const errorMessage = handleError(error)
        toast.error('Rol güncelleme hatası', errorMessage)
        throw error
      }
    },
    isPending: updateUserRoleMutation.isPending,
  }

  // Kullanıcı durumu güncelleme
  const updateUserStatus = {
    mutateAsync: async (id: string, data: UpdateUserStatusRequest) => {
      try {
        const result = await updateUserStatusMutation.mutateAsync({ id, data })
        const statusText = data.is_active ? 'aktif' : 'pasif'
        toast.success('Durum güncellendi', `Kullanıcı durumu ${statusText} olarak değiştirildi.`)
        return result
      } catch (error) {
        const errorMessage = handleError(error)
        toast.error('Durum güncelleme hatası', errorMessage)
        throw error
      }
    },
    isPending: updateUserStatusMutation.isPending,
  }

  // Kullanıcı silme
  const deleteUser = {
    mutateAsync: async (id: string) => {
      try {
        const result = await deleteUserMutation.mutateAsync(id)
        toast.success('Kullanıcı silindi', 'Kullanıcı başarıyla silindi.')
        return result
      } catch (error) {
        const errorMessage = handleError(error)
        toast.error('Silme hatası', errorMessage)
        throw error
      }
    },
    isPending: deleteUserMutation.isPending,
  }

  return {
    // Queries
    useUsers: (params?: GetUsersQuery) => useUsers(params),
    useUsersStatistics,
    useUser: (id: string) => useUser(id),

    // Mutations
    updateUser,
    updateUserRole,
    updateUserStatus,
    deleteUser,

    // Loading states
    isUpdating: updateUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
    isUpdatingStatus: updateUserStatusMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  }
} 