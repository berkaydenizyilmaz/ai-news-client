import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useErrorBoundary() {
  const { reset } = useQueryErrorResetBoundary()

  // Query hatalarını reset etmek için
  const resetQueries = () => {
    reset()
  }

  return { resetQueries }
}

// Query hatalarını Error Boundary'ye fırlatmak için
export function useThrowAsyncError(error?: Error) {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
} 