import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, BarChart3, Eye, TrendingUp, Calendar } from 'lucide-react'
import { NewsTable } from './NewsTable'
import { useNews, useCategoriesQuery, useNewsStatistics } from '@/features/news'
import type { NewsCategory, NewsListResponse, NewsStatistics } from '@/features/news'

export function NewsManagement() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort_by: 'published_at' as 'published_at' | 'view_count' | 'created_at',
    sort_order: 'desc' as 'asc' | 'desc',
    page: 1
  })

  // Sadece yayınlanan haberleri çek
  const { data: newsData, isLoading, refetch } = useNews({
    ...filters,
    status: 'published', // Sadece yayınlanan haberler
    category_id: filters.category || undefined,
    limit: 20,
  })

  const { data: categoriesData } = useCategoriesQuery({
    is_active: true,
    limit: 50
  })

  const { data: statistics } = useNewsStatistics()

  // Type assertions
  const typedNewsData = newsData as NewsListResponse | undefined
  const typedCategoriesData = categoriesData as { categories: NewsCategory[] } | undefined
  const typedStatistics = statistics as NewsStatistics | undefined

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleCategoryFilter = (category: string) => {
    const categoryValue = category === 'all' ? '' : category
    setFilters(prev => ({ ...prev, category: categoryValue, page: 1 }))
  }

  const handleSortChange = (sort_by: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sort_by: sort_by as 'published_at' | 'view_count' | 'created_at',
      page: 1 
    }))
  }

  const handleSortOrderChange = () => {
    setFilters(prev => ({ 
      ...prev, 
      sort_order: prev.sort_order === 'desc' ? 'asc' : 'desc',
      page: 1 
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getSortLabel = (sortBy: string) => {
    const labels: Record<string, string> = {
      'published_at': 'Yayın Tarihi',
      'view_count': 'Görüntülenme',
      'created_at': 'Oluşturma Tarihi'
    }
    return labels[sortBy] || sortBy
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Yayınlanan Haberler
          </h1>
          <p className="text-muted-foreground mt-2">
            Yayında olan haberleri görüntüleyin, düzenleyin ve analiz edin
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-2">
          <Eye className="h-4 w-4 mr-2" />
          Sadece Yayında Olanlar
        </Badge>
      </div>

      {/* Stats Cards */}
      {typedStatistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Haber</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typedStatistics.total_news}</div>
              <p className="text-xs text-muted-foreground">
                Tüm durumlar dahil
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama Güven</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                %{Math.round((typedStatistics.avg_confidence_score || 0) * 100)}
              </div>
              <p className="text-xs text-muted-foreground">
                AI güven skoru
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori Sayısı</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typedStatistics.categories_count}</div>
              <p className="text-xs text-muted-foreground">
                Aktif kategoriler
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler ve Sıralama
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Haber başlığında ara..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={filters.category || undefined} onValueChange={handleCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {typedCategoriesData?.categories.map((category: NewsCategory) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Select value={filters.sort_by} onValueChange={handleSortChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published_at">Yayın Tarihi</SelectItem>
                  <SelectItem value="view_count">Görüntülenme</SelectItem>
                  <SelectItem value="created_at">Oluşturma Tarihi</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="default"
                onClick={handleSortOrderChange}
                className="px-3"
              >
                {filters.sort_order === 'desc' ? '↓' : '↑'}
              </Button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
              Durum: Yayında
            </Badge>
            {filters.search && (
              <Badge variant="outline">
                Arama: "{filters.search}"
              </Badge>
            )}
            {filters.category && typedCategoriesData?.categories && (
              <Badge variant="outline">
                Kategori: {typedCategoriesData.categories.find(c => c.id === filters.category)?.name}
              </Badge>
            )}
            <Badge variant="outline">
              Sıralama: {getSortLabel(filters.sort_by)} ({filters.sort_order === 'desc' ? 'Azalan' : 'Artan'})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {typedNewsData && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {typedNewsData.total} yayınlanan haber bulundu
            {filters.search && ` - "${filters.search}" araması için`}
          </span>
          <span>
            Sayfa {typedNewsData.page} / {typedNewsData.totalPages}
          </span>
        </div>
      )}

      {/* News Table */}
      <NewsTable
        data={typedNewsData}
        isLoading={isLoading}
        onEdit={(newsId) => {
          // Haber detayına yönlendir
          window.open(`/news/${newsId}`, '_blank')
        }}
        onPageChange={handlePageChange}
        currentPage={filters.page}
      />

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? 'Yükleniyor...' : 'Yenile'}
        </Button>
      </div>
    </div>
  )
} 