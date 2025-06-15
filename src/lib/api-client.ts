import axios from 'axios'
import env from '@/config/env'
import { errorService, ErrorType } from './error-service'
import { navigationService } from './navigation-service'

/**
 * API istekleri için yapılandırılmış Axios örneği
 * Temel URL ve varsayılan başlıkları içerir
 */
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * İstek yakalayıcısı - İsteklere otomatik olarak kimlik doğrulama token'ı ekler
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Yanıt yakalayıcısı - API hatalarını işler ve normalize eder
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Hatayı normalize et
    const normalizedError = errorService.normalizeError(error)
    
    // Hatayı logla
    errorService.logError(normalizedError)
    
    // Auth hatası durumunda özel işlem
    if (normalizedError.type === ErrorType.AUTH) {
      navigationService.handleAuthError()
    }

    // API'den gelen mesajı kullan
    let errorMessage = normalizedError.message
    
    if (error.response?.data) {
      const data = error.response.data
      
      // API'den gelen mesaj formatını kontrol et
      if (data.message) {
        errorMessage = data.message
      } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // Validation hatalarını birleştir
        errorMessage = data.errors.map((err: unknown) => {
          if (typeof err === 'object' && err !== null && 'message' in err) {
            return (err as { message: string }).message
          }
          return String(err)
        }).join(', ')
      } else if (typeof data === 'string') {
        errorMessage = data
      }
    }

    // Enhanced error oluştur
    const enhancedError = new Error(errorMessage) as Error & { 
      response?: typeof error.response; 
      status?: number;
      appError?: typeof normalizedError;
    }
    enhancedError.name = error.name
    enhancedError.response = error.response
    enhancedError.status = error.response?.status
    enhancedError.appError = normalizedError
    
    return Promise.reject(enhancedError)
  }
)

export default apiClient 