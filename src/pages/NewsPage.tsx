import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { NewsList, CategoryFilter, NewsSearch, useNewsFilters } from '@/features/news'
import { Card } from '@/components/ui/card'

// Haber listesi sayfası
// Filtreleme, arama ve sayfalama özellikleri ile haberleri listeler
function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // URL parametrelerinden başlangıç değerlerini al
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('search') || ''
  const initialSort = searchParams.get('sort') as 'published_at' | 'view_count' || 'published_at'
  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  
  const {
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
  } = useNewsFilters()

  // URL parametrelerini başlangıçta ayarla
  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory)
    if (initialSearch) setSearch(initialSearch)
    if (initialSort) setSortBy(initialSort)
  }, [])

  // Filtreleme değişikliklerini URL'ye yansıt
  const updateURL = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Sayfa numarasını sıfırla
    params.delete('page')
    
    setSearchParams(params)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    updateURL({ category: categoryId })
  }

  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue)
    updateURL({ search: searchValue })
  }

  const handleSortChange = (newSortBy: 'published_at' | 'view_count', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    updateURL({ 
      sort: newSortBy,
      order: newSortOrder 
    })
  }

  const handleReset = () => {
    resetFilters()
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 border-b">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              📰 Haberler
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              En güncel haberleri keşfedin, kategorilere göre filtreleyin ve aradığınızı bulun
            </p>
            
            {/* Quick stats */}
            <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Canlı Güncelleniyor
              </div>
              <div>✨ AI Destekli</div>
              <div>🔍 Gelişmiş Filtreleme</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Search and Filters */}
        <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <div className="space-y-8">
            <NewsSearch
              search={search}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              onReset={handleReset}
            />
            
            <div className="border-t pt-8">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </Card>

        {/* News List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? 'Filtrelenmiş Haberler' : 'Tüm Haberler'}
            </h2>
            {(search || selectedCategory) && (
              <div className="text-sm text-muted-foreground">
                {search && `"${search}" araması için`}
                {search && selectedCategory && ' • '}
                {selectedCategory && 'Seçili kategoride'}
              </div>
            )}
          </div>
          
          <NewsList
            params={{
              ...filters,
              page: initialPage,
              limit: 12,
              status: 'published',
            }}
            title=""
            showPagination={true}
          />
        </div>
      </div>
    </div>
  )
}

export default NewsPage 