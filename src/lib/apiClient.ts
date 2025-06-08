import axios from 'axios'
import env from '@/config/env'

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
 * Yanıt yakalayıcısı - Kimlik doğrulama hatalarını işler ve yönlendirir
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz - logout
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient 