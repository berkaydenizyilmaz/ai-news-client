import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { router } from '@/lib/router'

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