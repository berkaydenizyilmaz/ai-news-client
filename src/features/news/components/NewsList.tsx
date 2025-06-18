import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { NewsCard } from './NewsCard'
import { useNews } from '../hooks/use-news'
import type { NewsQueryParams } from '../types'

interface NewsListProps {
  params?: NewsQueryParams
  title?: string
  showPagination?: boolean
  className?: string
}

export function NewsList({ 
  params = {}, 
  title = "Haberler",
  showPagination = true,
  className 
}: NewsListProps) {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch, params: currentParams, updateParams } = useNews(params)
  
  const handleNewsClick = (newsSlug: string) => {
    navigate(`/news/${newsSlug}`)
  }

  const handlePageChange = (page: number) => {
    updateParams({ page })
    // Sayfanın üstüne scroll
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Haberler yüklenemedi</h3>
        <p className="text-muted-foreground mb-4">
          Bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tekrar Dene
        </Button>
      </div>
    )
  }

  if (!data?.news.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-lg font-medium mb-2">Haber bulunamadı</h3>
        <p className="text-muted-foreground">
          Seçilen kriterlere uygun haber bulunmuyor.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            {data.total} haber bulundu
          </span>
        </div>
      )}

      {!title && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {data.total.toLocaleString('tr-TR')} Haber Bulundu
            </h2>
            <div className="h-6 w-px bg-border"></div>
            <span className="text-sm text-muted-foreground">
              Sayfa {currentParams.page} / {data.totalPages}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {data.news.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onClick={() => handleNewsClick(news.slug)}
          />
        ))}
      </div>

      {/* Sayfalama */}
      {showPagination && data.totalPages > 1 && (
        <div className="bg-card rounded-xl border p-6 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Toplam {data.total.toLocaleString('tr-TR')} haberden {((currentParams.page! - 1) * (currentParams.limit || 12) + 1).toLocaleString('tr-TR')}-{Math.min(currentParams.page! * (currentParams.limit || 12), data.total).toLocaleString('tr-TR')} arası gösteriliyor
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentParams.page! - 1)}
                disabled={currentParams.page === 1}
                className="px-6"
              >
                ← Önceki
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const page = i + 1
                  const isCurrentPage = page === currentParams.page
                  
                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={isCurrentPage ? "px-4" : "px-3"}
                    >
                      {page}
                    </Button>
                  )
                })}
                
                {data.totalPages > 5 && (
                  <>
                    <span className="px-2 text-muted-foreground">...</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(data.totalPages)}
                      className="px-3"
                    >
                      {data.totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentParams.page! + 1)}
                disabled={currentParams.page === data.totalPages}
                className="px-6"
              >
                Sonraki →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 