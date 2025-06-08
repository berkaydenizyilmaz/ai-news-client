import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import env from '@/config/env'

/**
 * QueryProvider bileşeni için props
 */
interface QueryProviderProps {
  /** Query client ile sarmalanacak alt bileşenler */
  children: React.ReactNode
}

/**
 * TanStack Query sağlayıcısı sarmalayıcısı
 * Uygulamaya query client sağlar ve geliştirme ortamında devtools içerir
 * @param props - Bileşen props'ları
 * @returns QueryClientProvider ve opsiyonel devtools ile JSX elementi
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
} 