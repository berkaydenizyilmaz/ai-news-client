import { apiClient } from '@/lib/api-client'
import type { 
  ProcessedNews, 
  NewsListResponse, 
  NewsStatistics,
  NewsQueryParams,
  CategoryQueryParams,
  NewsStatus,
  NewsCategory
} from '../types'

// Haber listesi API çağrısı
export const getNews = async (params: NewsQueryParams = {}): Promise<NewsListResponse> => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const response = await apiClient.get(`/news?${searchParams.toString()}`)
  return response.data.data
}

// Haber detayı API çağrısı
export const getNewsDetail = async (id: string): Promise<ProcessedNews> => {
  const response = await apiClient.get(`/news/${id}`)
  return response.data.data
}

// Kategori listesi API çağrısı
export const getCategories = async (params: CategoryQueryParams = {}): Promise<{
  categories: NewsCategory[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const response = await apiClient.get(`/news/categories?${searchParams.toString()}`)
  return response.data.data
}

// İstatistikler API çağrısı
export const getNewsStatistics = async (): Promise<NewsStatistics> => {
  const response = await apiClient.get('/news/statistics')
  return response.data.data
}

// Haber oluşturma API çağrısı (admin için)
export const createNews = async (data: {
  title: string
  content: string
  summary?: string
  image_url?: string
  category_id: string
  status: NewsStatus
  tags?: string[]
  meta_title?: string
  meta_description?: string
}): Promise<ProcessedNews> => {
  const response = await apiClient.post('/news', data)
  return response.data.data
}

// Haber güncelleme API çağrısı (admin için)
export const updateNews = async (id: string, data: Partial<{
  title: string
  content: string
  summary?: string
  image_url?: string
  category_id: string
  status: NewsStatus
  tags?: string[]
  meta_title?: string
  meta_description?: string
}>): Promise<ProcessedNews> => {
  const response = await apiClient.put(`/news/${id}`, data)
  return response.data.data
}

// Haber silme API çağrısı (admin için)
export const deleteNews = async (newsId: string): Promise<void> => {
  await apiClient.delete(`/news/${newsId}`)
} 