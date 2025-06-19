import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import * as newsApi from '../services/news-api'
import type { 
  NewsQueryParams, 
  CategoryQueryParams
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

// Haber listesi hook'u
export const useNews = (initialParams: NewsQueryParams = {}) => {
  const [params, setParams] = useState<NewsQueryParams>({
    page: 1,
    limit: 12,
    sort_by: 'published_at',
    sort_order: 'desc',
    ...initialParams
  })
  
  const updateParams = useCallback((newParams: Partial<NewsQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])
  
  const query = useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => newsApi.getNews(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
  
  return {
    ...query,
    params,
    updateParams
  }
}

// Haber detayı hook'u
export const useNewsDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: newsKeys.detail(id || ''),
    queryFn: () => newsApi.getNewsDetail(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 dakika
  })
}

// Kategoriler hook'u
export const useCategories = (params: CategoryQueryParams = {}) => {
  return useQuery({
    queryKey: newsKeys.categoryList(params),
    queryFn: () => newsApi.getCategories(params),
    staleTime: 15 * 60 * 1000, // 15 dakika
  })
}

// Kategoriler hook'u (alias for backward compatibility)
export const useCategoriesQuery = useCategories

// İstatistikler hook'u
export const useNewsStatistics = () => {
  return useQuery({
    queryKey: newsKeys.statistics(),
    queryFn: () => newsApi.getNewsStatistics(),
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Ana sayfa için haber verilerini getiren hook
export const useHomePageNews = () => {
  const latestNewsQuery = useNews({ 
    limit: 12, 
    sort_by: 'published_at', 
    sort_order: 'desc',
    status: 'published'
  })
  
  const categoriesQuery = useCategories({ 
    is_active: true, 
    limit: 20 
  })
  
  const statisticsQuery = useNewsStatistics()

  return {
    latestNews: (latestNewsQuery.data as any)?.news || [],
    categories: (categoriesQuery.data as any)?.categories || [],
    statistics: statisticsQuery.data,
    isLoading: latestNewsQuery.isLoading || categoriesQuery.isLoading || statisticsQuery.isLoading,
    isError: latestNewsQuery.isError || categoriesQuery.isError || statisticsQuery.isError,
    refetch: () => {
      latestNewsQuery.refetch()
      categoriesQuery.refetch()
      statisticsQuery.refetch()
    }
  }
}

// Haber filtreleme hook'u
export const useNewsFilters = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'published_at' | 'view_count'>('published_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const clearFilters = () => {
    queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
  }
  
  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSortBy('published_at')
    setSortOrder('desc')
    clearFilters()
  }
  
  // Filtreleri NewsQueryParams formatında döndür
  const filters: NewsQueryParams = {
    search: search || undefined,
    category_id: selectedCategory || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  }
  
  return { 
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    clearFilters,
    resetFilters
  }
}

// Admin için haber oluşturma mutation'ı
export const useCreateNews = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()
  
  return useMutation({
    mutationFn: newsApi.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all })
    },
    onError: handleError,
  })
}

// Admin için haber güncelleme mutation'ı
export const useUpdateNews = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      newsApi.updateNews(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all })
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(id) })
    },
    onError: handleError,
  })
}

// Admin için haber silme mutation'ı
export const useDeleteNews = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()
  
  return useMutation({
    mutationFn: newsApi.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all })
    },
    onError: handleError,
  })
} 