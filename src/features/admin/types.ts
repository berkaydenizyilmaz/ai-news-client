import type { LogLevel, LogModule } from '@/lib/log-service'

// Re-export types for easier access
export type { LogLevel, LogModule }

/**
 * Log kaydı arayüzü
 */
export interface Log {
  id: string
  level: LogLevel
  message: string
  module: LogModule
  user_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, string | number | boolean | null | undefined>
  created_at: string
}

/**
 * Sayfalama bilgileri
 */
export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
  has_next: boolean
  has_prev: boolean
}

/**
 * Log listesi yanıtı
 */
export interface LogsResponse {
  logs: Log[]
  pagination: PaginationInfo
}

/**
 * Log sorgu parametreleri
 */
export interface LogQuery {
  page?: number
  limit?: number
  level?: LogLevel
  module?: LogModule
  user_id?: string
  start_date?: string
  end_date?: string
}

/**
 * Log istatistikleri sorgu parametreleri
 */
export interface LogStatsQuery {
  days?: number
  module?: LogModule
}

/**
 * Log istatistikleri
 */
export interface LogStats {
  total_logs: number
  by_level: Record<LogLevel, number>
  by_module: Record<LogModule, number>
  daily_counts: Array<{
    date: string
    count: number
  }>
  period: {
    start_date: string
    end_date: string
    days: number
  }
}

/**
 * Eski logları temizleme isteği
 */
export interface ClearLogsRequest {
  before_date: string
  level?: LogLevel
  module?: LogModule
}

/**
 * Log temizleme yanıtı
 */
export interface ClearLogsResponse {
  deleted_count: number
  criteria: {
    before_date: string
    level?: LogLevel
    module?: LogModule
  }
} 