import { useCallback } from 'react'
import { errorService, type AppError } from '@/lib/error-service'

/**
 * Component seviyesinde hata yönetimi için hook
 */
export function useErrorHandler() {
  /**
   * Hatayı işler ve kullanıcıya uygun mesajı döner
   */
  const handleError = useCallback((error: unknown): string => {
    const normalizedError = errorService.normalizeError(error)
    errorService.logError(normalizedError)
    
    return errorService.getUserMessage(normalizedError)
  }, [])

  /**
   * Hatanın Error Boundary'ye fırlatılıp fırlatılmayacağını kontrol eder
   */
  const shouldThrowError = useCallback((error: unknown): boolean => {
    const normalizedError = errorService.normalizeError(error)
    return errorService.shouldThrowToErrorBoundary(normalizedError)
  }, [])

  /**
   * Hatanın kullanıcıya gösterilip gösterilmeyeceğini kontrol eder
   */
  const shouldShowError = useCallback((error: unknown): boolean => {
    const normalizedError = errorService.normalizeError(error)
    return errorService.shouldShowToUser(normalizedError)
  }, [])

  /**
   * Hata detaylarını normalize eder
   */
  const normalizeError = useCallback((error: unknown): AppError => {
    return errorService.normalizeError(error)
  }, [])

  return {
    handleError,
    shouldThrowError,
    shouldShowError,
    normalizeError
  }
} 