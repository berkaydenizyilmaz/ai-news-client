import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Filter } from 'lucide-react'
import { NewsTable } from './NewsTable'
import { useNews, useCategoriesQuery } from '@/features/news'
import type { NewsStatus, NewsCategory } from '@/features/news'

const NewsForm = ({ newsId, onClose }: { newsId: string | null, onClose: () => void, categories: NewsCategory[] }) => {
  // Basit placeholder component
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">
          {newsId ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
        </h2>
        <p>Form henüz hazır değil...</p>
        <Button onClick={onClose} className="mt-4">Kapat</Button>
      </div>
    </div>
  )
}

export function NewsManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '' as NewsStatus | '',
    category: '',
    page: 1
  })

  const { data: newsData, isLoading, refetch } = useNews({
    ...filters,
    status: filters.status || undefined,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  const { data: categoriesData } = useCategoriesQuery({
    is_active: true,
    limit: 50
  })

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    const statusValue = status === 'all' ? '' : status as NewsStatus
    setFilters(prev => ({ ...prev, status: statusValue, page: 1 }))
  }

  const handleCategoryFilter = (category: string) => {
    const categoryValue = category === 'all' ? '' : category
    setFilters(prev => ({ ...prev, category: categoryValue, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleCreateNews = () => {
    setEditingNews(null)
    setIsFormOpen(true)
  }

  const handleEditNews = (newsId: string) => {
    setEditingNews(newsId)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingNews(null)
    refetch()
  }

  const statusCounts = {
    total: newsData?.total || 0,
    published: 0,
    pending: 0,
    processing: 0,
    rejected: 0
  }

  // Bu veriler normalde ayrı bir API'den gelecek
  if (newsData?.news) {
    newsData.news.forEach(news => {
      statusCounts[news.status]++
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Haber Yönetimi</h1>
          <p className="text-muted-foreground">
            Haberleri yönetin, düzenleyin ve yayın durumlarını kontrol edin
          </p>
        </div>
        <Button onClick={handleCreateNews}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Haber
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yayında</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beklemede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İşleniyor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.processing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reddedilen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Haberlerde ara..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={filters.status || undefined} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="processing">İşleniyor</SelectItem>
                <SelectItem value="rejected">Reddedilen</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filters.category || undefined} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categoriesData?.categories.map((category: NewsCategory) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <NewsTable
        data={newsData}
        isLoading={isLoading}
        onEdit={handleEditNews}
        onPageChange={handlePageChange}
        currentPage={filters.page}
      />

      {/* News Form Modal */}
      {isFormOpen && (
        <NewsForm
          newsId={editingNews}
          onClose={handleFormClose}
          categories={categoriesData?.categories || []}
        />
      )}
    </div>
  )
} 