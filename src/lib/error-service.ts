/**
 * Hata türleri enum'u
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

/**
 * Hata şiddeti seviyeleri
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Standart hata arayüzü
 */
export interface AppError {
  /** Hata türü */
  type: ErrorType
  /** Hata şiddeti */
  severity: ErrorSeverity
  /** Kullanıcı dostu mesaj */
  message: string
  /** Teknik detaylar (opsiyonel) */
  details?: string
  /** HTTP status kodu (varsa) */
  statusCode?: number
  /** Hata kodu */
  code?: string
  /** Orijinal hata */
  originalError?: Error
}

/**
 * Hata servis sınıfı
 * Merkezi hata yönetimi, sınıflandırma ve kullanıcı bildirimleri
 */
class ErrorService {
  /**
   * HTTP status koduna göre hata türünü belirler
   */
  private getErrorTypeFromStatus(status: number): ErrorType {
    if (status === 401 || status === 403) return ErrorType.AUTH
    if (status >= 400 && status < 500) return ErrorType.VALIDATION
    if (status >= 500) return ErrorType.SERVER
    return ErrorType.UNKNOWN
  }

  /**
   * Hata şiddetini belirler
   */
  private getErrorSeverity(type: ErrorType, status?: number): ErrorSeverity {
    switch (type) {
      case ErrorType.AUTH:
        return ErrorSeverity.HIGH
      case ErrorType.SERVER:
        return status === 500 ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH
      case ErrorType.NETWORK:
        return ErrorSeverity.MEDIUM
      case ErrorType.VALIDATION:
        return ErrorSeverity.LOW
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  /**
   * Ham hatayı AppError formatına dönüştürür
   */
  normalizeError(error: unknown): AppError {
    // Zaten normalize edilmiş hata
    if (this.isAppError(error)) {
      return error
    }

    // Axios/API hatası
    if (this.isApiError(error)) {
      const status = error.response?.status || 0
      const type = this.getErrorTypeFromStatus(status)
      const severity = this.getErrorSeverity(type, status)
      
      return {
        type,
        severity,
        message: error.message || 'Bir hata oluştu',
        statusCode: status,
        details: error.response?.data?.message,
        originalError: error
      }
    }

    // Standart JavaScript hatası
    if (error instanceof Error) {
      return {
        type: ErrorType.CLIENT,
        severity: ErrorSeverity.MEDIUM,
        message: error.message || 'Beklenmeyen bir hata oluştu',
        originalError: error
      }
    }

    // Bilinmeyen hata
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: 'Bilinmeyen bir hata oluştu',
      details: String(error)
    }
  }

  /**
   * Hatanın AppError olup olmadığını kontrol eder
   */
  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'severity' in error &&
      'message' in error
    )
  }

  /**
   * Hatanın API hatası olup olmadığını kontrol eder
   */
  private isApiError(error: unknown): error is Error & { response?: { status: number; data?: any } } {
    return (
      error instanceof Error &&
      'response' in error &&
      typeof (error as any).response === 'object'
    )
  }

  /**
   * Hatanın kullanıcıya gösterilip gösterilmeyeceğini belirler
   */
  shouldShowToUser(error: AppError): boolean {
    // Kritik hatalar ve auth hataları her zaman gösterilir
    if (error.severity === ErrorSeverity.CRITICAL || error.type === ErrorType.AUTH) {
      return true
    }
    
    // Validation hataları gösterilir
    if (error.type === ErrorType.VALIDATION) {
      return true
    }

    // Network hataları gösterilir
    if (error.type === ErrorType.NETWORK) {
      return true
    }

    return false
  }

  /**
   * Hatanın Error Boundary'ye fırlatılıp fırlatılmayacağını belirler
   */
  shouldThrowToErrorBoundary(error: AppError): boolean {
    return error.severity === ErrorSeverity.CRITICAL || error.type === ErrorType.SERVER
  }

  /**
   * Hata için kullanıcı dostu mesaj üretir
   */
  getUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'İnternet bağlantınızı kontrol edin ve tekrar deneyin'
      case ErrorType.AUTH:
        return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın'
      case ErrorType.SERVER:
        return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin'
      case ErrorType.VALIDATION:
        return error.message
      default:
        return error.message || 'Bir hata oluştu'
    }
  }

  /**
   * Hatayı konsola loglar (geliştirme ortamında)
   */
  logError(error: AppError): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.type.toUpperCase()} ERROR [${error.severity}]`)
      console.error('Message:', error.message)
      if (error.details) console.error('Details:', error.details)
      if (error.statusCode) console.error('Status:', error.statusCode)
      if (error.originalError) console.error('Original:', error.originalError)
      console.groupEnd()
    }
  }
}

// Singleton instance
export const errorService = new ErrorService() 