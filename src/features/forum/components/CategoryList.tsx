import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Users, Clock } from 'lucide-react'
import { useForumCategories } from '../hooks/use-forum'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface CategoryListProps {
  onCategorySelect?: (categoryId: string) => void
}

export function CategoryList({ onCategorySelect }: CategoryListProps) {
  const { data: categories, isLoading, error } = useForumCategories()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
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
        <p className="text-muted-foreground">Kategoriler yüklenirken hata oluştu</p>
      </div>
    )
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Henüz kategori bulunmuyor</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCategorySelect?.(category.id)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              {category.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Aktif
                </Badge>
              )}
            </div>
            {category.description && (
              <CardDescription className="line-clamp-2">
                {category.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{category.topic_count} konu</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{category.post_count} gönderi</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(category.updated_at), {
                  addSuffix: true,
                  locale: tr
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 