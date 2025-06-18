import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { NewsList, CategoryFilter, NewsSearch, useNewsFilters } from '@/features/news'

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
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Haberler
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            En güncel haberleri keşfedin, kategorilere göre filtreleyin ve aradığınızı bulun
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Arama ve filtreleme */}
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6">
          <NewsSearch
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Haber listesi */}
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
  )
}

export default NewsPage 