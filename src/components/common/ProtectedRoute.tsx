import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/authentication'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
  redirectTo?: string
}

/**
 * Korumalı rota bileşeni
 * Kullanıcının giriş yapmış olmasını ve gerekli role sahip olmasını kontrol eder
 * Yetkisiz erişim durumunda belirlenen sayfaya yönlendirir
 */
export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Auth durumu yükleniyorsa loading göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Giriş yapmamışsa login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Admin yetkisi gerekiyorsa kontrol et
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 