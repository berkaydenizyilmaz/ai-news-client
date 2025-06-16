import { QueryClient } from '@tanstack/react-query'
import { errorService, ErrorType } from './error-service'

// Optimize edilmiş varsayılanlarla yapılandırılmış TanStack Query istemcisi
// Yeniden deneme mantığı, hata işleme ve önbellek yapılandırması içerir
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 dakika
      gcTime: 10 * 60 * 1000, // 10 dakika (eski cacheTime)
      retry: (failureCount, error) => {
        // Error service ile normalize et
        const normalizedError = errorService.normalizeError(error)
        
        // Auth ve client hatalarında retry yapma
        if (normalizedError.type === ErrorType.AUTH || normalizedError.statusCode === 404) {
            return false
        }
        
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      // Error boundary ile entegrasyon
      throwOnError: (error) => {
        const normalizedError = errorService.normalizeError(error)
        return errorService.shouldThrowToErrorBoundary(normalizedError)
      },
    },
    mutations: {
      retry: false,
      // Mutation hatalarını da Error Boundary'ye fırlat
      throwOnError: (error) => {
        const normalizedError = errorService.normalizeError(error)
        return errorService.shouldThrowToErrorBoundary(normalizedError)
      },
    },
  },
}) 