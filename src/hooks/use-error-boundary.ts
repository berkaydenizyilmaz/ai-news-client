import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import { errorService } from '@/lib/error-service'

// TanStack Query ile Error Boundary entegrasyonu için özel hook
export function useErrorBoundary() {
  const { reset } = useQueryErrorResetBoundary()

  // TanStack Query'deki tüm sorgu hatalarını sıfırlar
  const resetQueries = () => {
    reset()
  }

  return { resetQueries }
}

// Asenkron hataları Error Boundary'ye fırlatmak için hook
// error - Fırlatılacak opsiyonel hata
export function useThrowAsyncError(error?: unknown) {
  useEffect(() => {
    if (error) {
      // Error service ile normalize et
      const normalizedError = errorService.normalizeError(error)
      
      // Sadece Error Boundary'ye fırlatılması gereken hataları fırlat
      if (errorService.shouldThrowToErrorBoundary(normalizedError)) {
      throw error
      }
    }
  }, [error])
} 