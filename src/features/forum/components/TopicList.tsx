import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Eye, ThumbsUp, Pin, Lock, Search, Filter } from 'lucide-react'
import { useForumTopics } from '../hooks/use-forum'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { TopicsQueryParams } from '../types'

interface TopicListProps {
  categoryId?: string
  onTopicSelect?: (topicId: string) => void
}

export function TopicList({ categoryId, onTopicSelect }: TopicListProps) {
  const [params, setParams] = useState<TopicsQueryParams>({
    category_id: categoryId,
    page: 1,
    limit: 20,
    sort_by: 'last_reply_at',
    sort_order: 'desc'
  })

  const { data, isLoading, error } = useForumTopics(params)

  const updateParams = (newParams: Partial<TopicsQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }))
  }

  const handleSearch = (search: string) => {
    updateParams({ search: search || undefined })
  }

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split('-')
    updateParams({ 
      sort_by: sort_by as TopicsQueryParams['sort_by'], 
      sort_order: sort_order as 'asc' | 'desc' 
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Konular yüklenirken hata oluştu</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Konu ara..."
            className="pl-10"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={handleSortChange} defaultValue="last_reply_at-desc">
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_reply_at-desc">Son yanıt</SelectItem>
            <SelectItem value="created_at-desc">En yeni</SelectItem>
            <SelectItem value="view_count-desc">En çok görüntülenen</SelectItem>
            <SelectItem value="reply_count-desc">En çok yanıtlanan</SelectItem>
            <SelectItem value="like_count-desc">En çok beğenilen</SelectItem>
            <SelectItem value="title-asc">Başlık (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Topics */}
      {!data?.topics?.length ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {params.search ? 'Arama kriterlerine uygun konu bulunamadı' : 'Henüz konu bulunmuyor'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.topics.map((topic) => (
            <Card 
              key={topic.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTopicSelect?.(topic.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.is_pinned && <Pin className="h-4 w-4 text-orange-500" />}
                      {topic.status === 'locked' && <Lock className="h-4 w-4 text-red-500" />}
                      <CardTitle className="text-lg line-clamp-1">{topic.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {topic.content}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {topic.category.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {topic.user.username}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {topic.last_reply_at && (
                      <div className="mb-1">
                        Son yanıt: {formatDistanceToNow(new Date(topic.last_reply_at), {
                          addSuffix: true,
                          locale: tr
                        })}
                      </div>
                    )}
                    <div>
                      {formatDistanceToNow(new Date(topic.created_at), {
                        addSuffix: true,
                        locale: tr
                      })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{topic.reply_count} yanıt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{topic.view_count} görüntülenme</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{topic.like_count} beğeni</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={params.page === 1}
            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
          >
            Önceki
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Sayfa {params.page} / {data.total_pages}
          </span>
          <Button
            variant="outline"
            disabled={params.page === data.total_pages}
            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  )
} 