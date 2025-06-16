import { apiClient } from './api-client'

// Log seviyeleri (API dokümantasyonuna uygun)
export type LogLevel = 'info' | 'warning' | 'error' | 'debug'

// Uygulama modülleri
export type LogModule = 'auth' | 'rss' | 'news' | 'settings' | 'forum' | 'users' | 'reports' | 'notification'

// Log metadata için genel tip
export type LogMetadata = Record<string, string | number | boolean | null | undefined>

// Log kaydı oluşturma için gerekli veriler
export interface CreateLogRequest {
  level: LogLevel
  message: string
  module: LogModule
  user_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: LogMetadata
}

// Merkezi log servisi
// Tüm uygulama genelinde log kayıtları oluşturmak için kullanılır
class LogService {
  // Bilgi seviyesinde log kaydı oluşturur
  async info(module: LogModule, message: string, metadata?: LogMetadata) {
    return this.createLog({
      level: 'info',
      module,
      message,
      metadata,
    })
  }

  // Uyarı seviyesinde log kaydı oluşturur
  async warning(module: LogModule, message: string, metadata?: LogMetadata) {
    return this.createLog({
      level: 'warning',
      module,
      message,
      metadata,
    })
  }

  // Hata seviyesinde log kaydı oluşturur
  async error(module: LogModule, message: string, metadata?: LogMetadata) {
    return this.createLog({
      level: 'error',
      module,
      message,
      metadata,
    })
  }

  // Debug seviyesinde log kaydı oluşturur
  async debug(module: LogModule, message: string, metadata?: LogMetadata) {
    return this.createLog({
      level: 'debug',
      module,
      message,
      metadata,
    })
  }

  // Log kaydı oluşturur
  private async createLog(logData: CreateLogRequest) {
    try {
      // Tarayıcı bilgilerini otomatik ekle
      const enrichedLogData = {
        ...logData,
        user_agent: navigator.userAgent,
        // IP adresi backend tarafından alınacak
      }

      const response = await apiClient.post('/logs', enrichedLogData)
      return response.data
    } catch (error) {
      // Log kaydı başarısız olursa sadece development'ta console'a yazdır
      // Production'da sessizce başarısız ol (log servisi çalışmıyorsa uygulama durmasın)
      if (process.env.NODE_ENV === 'development') {
        console.error('Log kaydı oluşturulamadı:', error)
        console.log('Log verisi:', logData)
      }
    }
  }

  // Kullanıcı bilgilerini log kaydına eklemek için yardımcı metod
  async logWithUser(
    userId: string,
    module: LogModule,
    message: string,
    level: LogLevel = 'info',
    metadata?: LogMetadata
  ) {
    return this.createLog({
      level,
      module,
      message,
      user_id: userId,
      metadata,
    })
  }
}

// Singleton log service instance
export const logService = new LogService() 