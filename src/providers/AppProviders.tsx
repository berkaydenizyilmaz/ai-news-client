import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { router } from '@/lib/router'

export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  )
} 