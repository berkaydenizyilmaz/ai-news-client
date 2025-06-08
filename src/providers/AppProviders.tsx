import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { router } from '@/lib/router'

export function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
} 