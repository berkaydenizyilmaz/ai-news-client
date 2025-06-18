import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { 
  ProcessedNews, 
  NewsListResponse, 
  NewsStatistics,
  NewsQueryParams,
  CategoryQueryParams,
  NewsStatus
} from '../types'

// Query Keys
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (params: NewsQueryParams) => [...newsKeys.lists(), params] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
  categories: () => [...newsKeys.all, 'categories'] as const,
  categoryList: (params: CategoryQueryParams) => [...newsKeys.categories(), params] as const,
  statistics: () => [...newsKeys.all, 'statistics'] as const,
}

// Haber listesi çekme
export const useNewsQuery = (params: NewsQueryParams = {}) => {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: async (): Promise<NewsListResponse> => {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })

      const response = await apiClient.get(`/api/news?${searchParams.toString()}`)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Haber detayı çekme
export const useNewsDetailQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: newsKeys.detail(id || ''),
    queryFn: async (): Promise<ProcessedNews> => {
      if (!id) throw new Error('News ID is required')
      const response = await apiClient.get(`/api/news/${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 dakika
  })
}

// Kategori listesi çekme
export const useCategoriesQuery = (params: CategoryQueryParams = {}) => {
  return useQuery({
    queryKey: newsKeys.categoryList(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })

      const response = await apiClient.get(`/api/news/categories?${searchParams.toString()}`)
      return response.data.data
    },
    staleTime: 15 * 60 * 1000, // 15 dakika
  })
}

// İstatistikler çekme
export const useNewsStatisticsQuery = () => {
  return useQuery({
    queryKey: newsKeys.statistics(),
    queryFn: async (): Promise<NewsStatistics> => {
      const response = await apiClient.get('/api/news/statistics')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Haber oluşturma mutation'ı (admin için)
export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      title: string
      content: string
      summary?: string
      image_url?: string
      category_id: string
      status: NewsStatus
      tags?: string[]
      meta_title?: string
      meta_description?: string
    }) => {
      const response = await apiClient.post('/news', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: (error) => {
      console.error('News oluşturma hatası:', error)
    }
  })
}

// Haber güncelleme mutation'ı (admin için)
export const useUpdateNewsMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string
      data: Partial<{
        title: string
        content: string
        summary?: string
        image_url?: string
        category_id: string
        status: NewsStatus
        tags?: string[]
        meta_title?: string
        meta_description?: string
      }>
    }) => {
      const response = await apiClient.put(`/news/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      queryClient.invalidateQueries({ queryKey: ['news', id] })
    },
    onError: (error) => {
      console.error('News güncelleme hatası:', error)
    }
  })
}

// Haber silme mutation'ı (admin için)
export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newsId: string) => {
      const response = await apiClient.delete(`/news/${newsId}`)
      return response.data
    },
    onSuccess: () => {
      // Tüm news cache'lerini invalidate et
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: (error) => {
      console.error('News silme hatası:', error)
    }
  })
} 