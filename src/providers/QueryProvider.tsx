import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import env from '@/config/env'

// QueryProvider bileşeni için props
interface QueryProviderProps {
  // Query client ile sarmalanacak alt bileşenler
  children: React.ReactNode
}

// TanStack Query sağlayıcısı sarmalayıcısı
// Uygulamaya query client sağlar ve geliştirme ortamında devtools içerir
// props - Bileşen props'ları
// QueryClientProvider ve opsiyonel devtools ile JSX elementi döner
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