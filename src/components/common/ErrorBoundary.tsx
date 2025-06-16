import React from 'react'
import { DefaultErrorFallback } from '@/components/common/DefaultErrorFallback'
import { errorService } from '@/lib/error-service'

// Error boundary durum arayüzü
interface ErrorBoundaryState {
  // Bir hata oluşup oluşmadığı
  hasError: boolean
  // Oluşan hata
  error?: Error
}

// Error boundary props arayüzü
interface ErrorBoundaryProps {
  // Error boundary ile sarmalanacak alt bileşenler
  children: React.ReactNode
  // Hatalar için opsiyonel özel fallback bileşeni
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

// Error boundary bileşeni
// Alt bileşen ağacının herhangi bir yerindeki JavaScript hatalarını yakalar
// ve tüm uygulamanın çökmesi yerine bir fallback UI görüntüler
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // Bir hata yakalandığında durumu günceller
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // Bir hata yakalandığında hata bilgilerini loglar
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error service ile normalize et ve logla
    const normalizedError = errorService.normalizeError(error)
    errorService.logError(normalizedError)
    
    console.error('Error Boundary yakaladı:', error, errorInfo)
  }

  // Yeniden deneme için hata durumunu sıfırlar
  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

 