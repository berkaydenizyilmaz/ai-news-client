import { redirect } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Auth durumunu kontrol eden loader fonksiyonu
 * Modern React Router v6.4+ pattern'i
 */
export const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState()
  
  if (!isAuthenticated) {
    throw redirect('/login')
  }
  
  return null
}

/**
 * Admin yetkisi gerektiren loader fonksiyonu
 */
export const requireAdmin = () => {
  const { isAuthenticated, user } = useAuthStore.getState()
  
  if (!isAuthenticated) {
    throw redirect('/login')
  }
  
  if (user?.role !== 'admin') {
    throw redirect('/')
  }
  
  return null
}

/**
 * Giriş yapmış kullanıcıları ana sayfaya yönlendiren loader
 * Login/Register sayfaları için
 */
export const redirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState()
  
  if (isAuthenticated) {
    throw redirect('/')
  }
  
  return null
} 