import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { router } from '@/lib/router'

/**
 * Ana uygulama sağlayıcıları sarmalayıcısı
 * Uygulama için gerekli tüm sağlayıcıları birleştirir:
 * - Hata işleme için ErrorBoundary
 * - Tema yönetimi için ThemeProvider
 * - TanStack Query için QueryProvider
 * - Yönlendirme için RouterProvider
 * @returns Tüm sağlayıcıların yapılandırıldığı JSX elementi
 */
export function AppProviders() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="ai-news-theme">
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
} 