import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, SortAsc, SortDesc, RefreshCw } from 'lucide-react'
import { useNewsComments } from '../hooks/use-comments'
import { CommentForm } from './CommentForm'
import { Comment } from './Comment'
import type { CommentQueryParams } from '../types'

interface CommentsSectionProps {
  newsId: string
  newsTitle?: string
  className?: string
}

export function CommentsSection({ newsId, newsTitle, className }: CommentsSectionProps) {
  const [queryParams, setQueryParams] = useState<CommentQueryParams>({
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  const { 
    data: commentsData, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching
  } = useNewsComments(newsId, queryParams)

  const handleSortChange = (sortBy: 'created_at' | 'updated_at') => {
    setQueryParams(prev => ({
      ...prev,
      sort_by: sortBy,
      page: 1 // Reset to first page when sorting changes
    }))
  }

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    setQueryParams(prev => ({
      ...prev,
      sort_order: sortOrder,
      page: 1
    }))
  }

  const handleLoadMore = () => {
    if (commentsData && queryParams.page && queryParams.page < commentsData.totalPages) {
      setQueryParams(prev => ({
        ...prev,
        page: (prev.page || 1) + 1
      }))
    }
  }

  const totalComments = commentsData?.total || 0

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Yorumlar ({totalComments})
            </CardTitle>
            
            {/* Sort controls */}
            <div className="flex items-center gap-2">
              <Select 
                value={queryParams.sort_by} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Tarih</SelectItem>
                  <SelectItem value="updated_at">Güncellenme</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortOrderChange(
                  queryParams.sort_order === 'desc' ? 'asc' : 'desc'
                )}
              >
                {queryParams.sort_order === 'desc' ? (
                  <SortDesc className="h-4 w-4" />
                ) : (
                  <SortAsc className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Comment form */}
          <CommentForm
            newsId={newsId}
            placeholder={`"${newsTitle}" hakkında ne düşünüyorsunuz?`}
          />

          {/* Comments list */}
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Yorumlar yüklenemedi</h3>
              <p className="text-muted-foreground mb-4">
                Bir hata oluştu: {error?.message || 'Bilinmeyen hata'}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Tekrar Dene
              </Button>
            </div>
          ) : !commentsData?.comments?.length ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
              <p className="text-muted-foreground">
                Bu habere ilk yorumu siz yapın!
              </p>
            </div>
          ) : (
            <>
              {/* Comments */}
              <div className="divide-y divide-border">
                {commentsData.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    newsId={newsId}
                  />
                ))}
              </div>

              {/* Load more button */}
              {commentsData.page < commentsData.totalPages && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      `Daha Fazla Yorum Yükle (${commentsData.totalPages - commentsData.page} sayfa kaldı)`
                    )}
                  </Button>
                </div>
              )}

              {/* Pagination info */}
              <div className="text-center text-sm text-muted-foreground">
                {commentsData.comments.length} / {totalComments} yorum gösteriliyor
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Comment skeleton component
function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-4">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )
} 