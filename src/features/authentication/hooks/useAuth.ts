import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useLogin, useRegister } from '../services/authApi'
import type { LoginRequest, RegisterRequest } from '../types'

/**
 * Kimlik doğrulama işlemleri için özel hook
 * Giriş, kayıt, çıkış işlevselliği ve auth durumu sağlar
 * @returns Kimlik doğrulama durumu ve metodları
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } = useAuthStore()
  
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  /**
   * Kullanıcıyı e-posta ve şifre ile kimlik doğrulaması yapar
   * @param data - Giriş kimlik bilgileri
   * @returns Başarı durumu ve mesaj/hata ile Promise
   */
  const login = async (data: LoginRequest) => {
    setLoading(true)
    try {
      const response = await loginMutation.mutateAsync(data)
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token)
        return { success: true, message: response.message }
      }
      return { success: false, error: response.error || 'Giriş başarısız' }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Beklenmeyen hata' 
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Yeni bir kullanıcı hesabı kaydeder
   * @param data - Kayıt verileri
   * @returns Başarı durumu ve mesaj/hata ile Promise
   */
  const register = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      const response = await registerMutation.mutateAsync(data)
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token)
        return { success: true, message: response.message }
      }
      return { success: false, error: response.error || 'Kayıt başarısız' }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Beklenmeyen hata' 
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mevcut kullanıcıyı çıkış yapar ve ana sayfaya yönlendirir
   */
  const logout = () => {
    clearAuth()
    // TanStack Query cache'ini temizle
    queryClient.clear()
    // Admin sayfasındaysa ana sayfaya yönlendir
    const currentPath = window.location.pathname
    if (currentPath.startsWith('/admin')) {
      navigate('/', { replace: true })
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading: useAuthStore(state => state.isLoading),
    
    // Actions
    login,
    register,
    logout,
    
    // Mutation states
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  }
} 