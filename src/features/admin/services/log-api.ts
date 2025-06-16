import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse } from '@/lib/types'
import type { 
  Log, 
  LogsResponse, 
  LogQuery, 
  LogStats, 
  LogStatsQuery, 
  ClearLogsRequest, 
  ClearLogsResponse 
} from '../types'

// Log API fonksiyonları
// Admin panelinde log yönetimi için kullanılır
const logApi = {
  // Tüm logları getirir (sayfalama ve filtreleme ile)
  getLogs: async (params?: LogQuery): Promise<ApiResponse<LogsResponse>> => {
    const response = await apiClient.get('/logs', { params })
    return response.data
  },

  // Belirli bir logu ID'ye göre getirir
  getLogById: async (id: string): Promise<ApiResponse<Log>> => {
    const response = await apiClient.get(`/logs/${id}`)
    return response.data
  },

  // Log istatistiklerini getirir
  getLogStats: async (params?: LogStatsQuery): Promise<ApiResponse<LogStats>> => {
    const response = await apiClient.get('/logs/stats', { params })
    return response.data
  },

  // Eski logları temizler
  clearLogs: async (data: ClearLogsRequest): Promise<ApiResponse<ClearLogsResponse>> => {
    const response = await apiClient.delete('/logs/clear', { data })
    return response.data
  },
}

// TanStack Query Hooks

// Log listesi getirmek için TanStack Query hook'u
export const useLogs = (params?: LogQuery) => {
  return useQuery({
    queryKey: ['admin', 'logs', 'list', params],
    queryFn: () => logApi.getLogs(params),
    staleTime: 30000, // 30 saniye
  })
}

// Belirli bir log getirmek için TanStack Query hook'u
export const useLog = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'logs', 'detail', id],
    queryFn: () => logApi.getLogById(id),
    enabled: !!id,
  })
}

// Log istatistikleri getirmek için TanStack Query hook'u
export const useLogStats = (params?: LogStatsQuery) => {
  return useQuery({
    queryKey: ['admin', 'logs', 'stats', params],
    queryFn: () => logApi.getLogStats(params),
    staleTime: 60000, // 1 dakika
  })
}

// Eski logları temizlemek için TanStack Query mutation hook'u
export const useClearLogs = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: logApi.clearLogs,
    onSuccess: () => {
      // Tüm log verilerini yenile
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] })
    },
  })
} 