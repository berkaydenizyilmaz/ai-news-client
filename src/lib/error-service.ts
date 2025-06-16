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
 * Backend API'den gelen hata mesajlarına göre mapping
 * API dokümantasyonundaki hata formatlarına uygun
 */
const ERROR_MESSAGE_MAP: Record<string, { type: ErrorType; message: string; severity: ErrorSeverity }> = {
  // Authentication errors (API'den gelen mesajlar)
  'Token bulunamadı': {
    type: ErrorType.AUTH,
    message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın',
    severity: ErrorSeverity.HIGH
  },
  'Geçersiz token': {
    type: ErrorType.AUTH,
    message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın',
    severity: ErrorSeverity.HIGH
  },
  'Bu işlem için yetkiniz yok': {
    type: ErrorType.AUTH,
    message: 'Bu işlem için yetkiniz bulunmuyor',
    severity: ErrorSeverity.HIGH
  },
  
  // Validation errors
  'Geçersiz veri formatı': {
    type: ErrorType.VALIDATION,
    message: 'Girilen bilgiler geçersiz',
    severity: ErrorSeverity.LOW
  },
  
  // Not found errors
  'Kaynak bulunamadı': {
    type: ErrorType.VALIDATION,
    message: 'Aranan kaynak bulunamadı',
    severity: ErrorSeverity.LOW
  },
  
  // Server errors
  'Sunucu hatası oluştu': {
    type: ErrorType.SERVER,
    message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin',
    severity: ErrorSeverity.HIGH
  }
}

/**
 * HTTP status koduna göre varsayılan hata mapping'i
 */
const STATUS_CODE_MAP: Record<number, { type: ErrorType; message: string; severity: ErrorSeverity }> = {
  400: {
    type: ErrorType.VALIDATION,
    message: 'Geçersiz istek',
    severity: ErrorSeverity.LOW
  },
  401: {
    type: ErrorType.VALIDATION,
    message: 'E-posta adresi veya şifre hatalı',
    severity: ErrorSeverity.LOW
  },
  403: {
    type: ErrorType.AUTH,
    message: 'Bu işlem için yetkiniz bulunmuyor',
    severity: ErrorSeverity.HIGH
  },
  404: {
    type: ErrorType.VALIDATION,
    message: 'Aranan kaynak bulunamadı',
    severity: ErrorSeverity.LOW
  },
  422: {
    type: ErrorType.VALIDATION,
    message: 'Girilen bilgiler geçersiz',
    severity: ErrorSeverity.LOW
  },
  429: {
    type: ErrorType.VALIDATION,
    message: 'Çok fazla istek gönderildi. Lütfen bekleyin',
    severity: ErrorSeverity.MEDIUM
  },
  500: {
    type: ErrorType.SERVER,
    message: 'Sunucu hatası oluştu',
    severity: ErrorSeverity.CRITICAL
  },
  502: {
    type: ErrorType.SERVER,
    message: 'Sunucu geçici olarak kullanılamıyor',
    severity: ErrorSeverity.HIGH
  },
  503: {
    type: ErrorType.SERVER,
    message: 'Servis geçici olarak kullanılamıyor',
    severity: ErrorSeverity.HIGH
  }
}

/**
 * Hata servis sınıfı
 * Merkezi hata yönetimi, sınıflandırma ve kullanıcı bildirimleri
 */
class ErrorService {


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
      const responseData = error.response?.data
      
      // 1. Öncelik: Backend mesaj mapping
      const backendMessage = responseData?.error || responseData?.message
      if (backendMessage && ERROR_MESSAGE_MAP[backendMessage]) {
        const mapping = ERROR_MESSAGE_MAP[backendMessage]
        return {
          type: mapping.type,
          severity: mapping.severity,
          message: mapping.message,
          statusCode: status,
          details: backendMessage,
          originalError: error
        }
      }
      
      // 2. İkinci öncelik: Status code mapping
      if (STATUS_CODE_MAP[status]) {
        const mapping = STATUS_CODE_MAP[status]
        return {
          type: mapping.type,
          severity: mapping.severity,
          message: mapping.message,
          statusCode: status,
          details: responseData?.error || responseData?.message,
          originalError: error
        }
      }
      
      // 3. Son çare: Genel hata
      return {
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        message: responseData?.error || responseData?.message || error.message || 'Bir hata oluştu',
        statusCode: status,
        details: responseData?.error || responseData?.message,
        originalError: error
      }
    }

    // Network hatası (bağlantı yok, timeout vb.)
    if (error instanceof Error && error.message.includes('Network Error')) {
      return {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        message: 'İnternet bağlantınızı kontrol edin',
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
  private isApiError(error: unknown): error is Error & { 
    response?: { 
      status: number; 
      data?: { 
        message?: string;
        error?: string;
        errors?: Array<{
          field: string;
          message: string;
        }>;
      } 
    } 
  } {
    return (
      error instanceof Error &&
      'response' in error &&
      typeof (error as Error & { response?: unknown }).response === 'object'
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
   * Mapping sisteminde mesaj zaten normalize edilmiş olur
   */
  getUserMessage(error: AppError): string {
    // Mapping sisteminden gelen mesajlar zaten kullanıcı dostu
    return error.message || 'Bir hata oluştu'
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