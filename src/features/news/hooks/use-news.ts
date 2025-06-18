import { useState, useMemo } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { 
  useNewsQuery, 
  useNewsDetailQuery, 
  useCategoriesQuery,
  useNewsStatisticsQuery 
} from '../services/news-api'
import type { NewsQueryParams, CategoryQueryParams } from '../types'

// Haber listesi için hook
export const useNews = (initialParams: NewsQueryParams = {}) => {
  const [params, setParams] = useState<NewsQueryParams>({
    page: 1,
    limit: 12,
    status: 'published',
    sort_by: 'published_at',
    sort_order: 'desc',
    ...initialParams,
  })

  const { handleError } = useErrorHandler()
  
  const query = useNewsQuery(params)

  // Hata durumunda error handler'ı çağır
  if (query.error) {
    handleError(query.error)
  }

  const updateParams = (newParams: Partial<NewsQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }

  const resetParams = () => {
    setParams({
      page: 1,
      limit: 12,
      status: 'published',
      sort_by: 'published_at',
      sort_order: 'desc',
    })
  }

  return {
    ...query,
    params,
    updateParams,
    resetParams,
  }
}

// Haber detayı için hook
export const useNewsDetail = (id: string | undefined) => {
  const { handleError } = useErrorHandler()
  
  const query = useNewsDetailQuery(id)

  // Hata durumunda error handler'ı çağır
  if (query.error) {
    handleError(query.error)
  }

  return query
}

// Kategoriler için hook
export const useCategories = (initialParams: CategoryQueryParams = {}) => {
  const [params, setParams] = useState<CategoryQueryParams>({
    is_active: true,
    sort_by: 'name',
    sort_order: 'asc',
    ...initialParams,
  })

  const { handleError } = useErrorHandler()
  
  const query = useCategoriesQuery(params)

  // Hata durumunda error handler'ı çağır
  if (query.error) {
    handleError(query.error)
  }

  const updateParams = (newParams: Partial<CategoryQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }

  return {
    ...query,
    params,
    updateParams,
  }
}

// Ana sayfa için özel hook
export const useHomePageNews = () => {
  // Son haberler
  const latestNews = useNews({
    page: 1,
    limit: 6,
    status: 'published',
    sort_by: 'published_at',
    sort_order: 'desc',
  })

  // Kategoriler
  const categories = useCategories({
    is_active: true,
    limit: 10,
  })

  // İstatistikler
  const statistics = useNewsStatisticsQuery()

  const isLoading = latestNews.isLoading || categories.isLoading || statistics.isLoading
  const isError = latestNews.isError || categories.isError || statistics.isError

  return {
    latestNews: latestNews.data?.news || [],
    categories: categories.data?.categories || [],
    statistics: statistics.data,
    isLoading,
    isError,
    refetch: () => {
      latestNews.refetch()
      categories.refetch()
      statistics.refetch()
    },
  }
}

// Arama ve filtreleme için yardımcı hook
export const useNewsFilters = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'published_at' | 'view_count'>('published_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filters = useMemo(() => ({
    search: search.trim() || undefined,
    category_id: selectedCategory || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  }), [search, selectedCategory, sortBy, sortOrder])

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSortBy('published_at')
    setSortOrder('desc')
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
    resetFilters,
  }
} 