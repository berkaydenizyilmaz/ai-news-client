import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from './types'

/**
 * Bir hatanın ApiError olup olmadığını kontrol eden tip koruyucusu
 * @param error - Kontrol edilecek hata
 * @returns Hata ApiError ise true döner
 */
const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'message' in error
}

/**
 * Optimize edilmiş varsayılanlarla yapılandırılmış TanStack Query istemcisi
 * Yeniden deneme mantığı, hata işleme ve önbellek yapılandırması içerir
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 dakika
      gcTime: 10 * 60 * 1000, // 10 dakika (eski cacheTime)
      retry: (failureCount, error) => {
        // 401, 403, 404 hatalarında retry yapma
        if (isApiError(error)) {
          const status = error.response?.status
          if (status === 401 || status === 403 || status === 404) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      // Error boundary ile entegrasyon
      throwOnError: (error) => {
        // 500+ server hatalarını Error Boundary'ye fırlat
        if (isApiError(error)) {
          return (error.response?.status ?? 0) >= 500
        }
        return false
      },
    },
    mutations: {
      retry: false,
      // Mutation hatalarını da Error Boundary'ye fırlat
      throwOnError: (error) => {
        if (isApiError(error)) {
          return (error.response?.status ?? 0) >= 500
        }
        return false
      },
    },
  },
}) 