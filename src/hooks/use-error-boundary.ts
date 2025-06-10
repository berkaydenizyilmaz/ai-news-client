import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'

/**
 * TanStack Query ile Error Boundary entegrasyonu için özel hook
 * @returns resetQueries fonksiyonunu içeren nesne
 */
export function useErrorBoundary() {
  const { reset } = useQueryErrorResetBoundary()

  /**
   * TanStack Query'deki tüm sorgu hatalarını sıfırlar
   */
  const resetQueries = () => {
    reset()
  }

  return { resetQueries }
}

/**
 * Asenkron hataları Error Boundary'ye fırlatmak için hook
 * @param error - Fırlatılacak opsiyonel hata
 */
export function useThrowAsyncError(error?: Error) {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
} 