import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logService } from '@/lib/logService'
import type { User } from '@/features/authentication/types'

/**
 * Kimlik doğrulama durumu arayüzü
 */
interface AuthState {
  /** Mevcut kimlik doğrulanmış kullanıcı */
  user: User | null
  /** Kimlik doğrulama token'ı */
  token: string | null
  /** Kullanıcının kimlik doğrulanıp doğrulanmadığı */
  isAuthenticated: boolean
  /** Auth işlemleri için yükleme durumu */
  isLoading: boolean
}

/**
 * Kimlik doğrulama eylemleri arayüzü
 */
interface AuthActions {
  /** Kullanıcı kimlik doğrulama verilerini ayarla */
  setAuth: (user: User, token: string) => void
  /** Kimlik doğrulama verilerini temizle */
  clearAuth: () => void
  /** Yükleme durumunu ayarla */
  setLoading: (loading: boolean) => void
  /** Kullanıcı verilerini kısmen güncelle */
  updateUser: (user: Partial<User>) => void
}

/**
 * Birleştirilmiş auth store tipi
 */
type AuthStore = AuthState & AuthActions

/**
 * Kimlik doğrulama durum yönetimi için Zustand store'u
 * Kullanıcı verilerini ve token'ı localStorage'a kalıcı olarak kaydeder
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token)
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      clearAuth: () => {
        const currentUser = get().user
        
        // Çıkış logu
        if (currentUser) {
          logService.info('auth', 'Kullanıcı çıkış yaptı', {
            user_id: currentUser.id,
            email: currentUser.email,
            logout_method: 'manual'
          })
        }
        
        localStorage.removeItem('auth_token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 