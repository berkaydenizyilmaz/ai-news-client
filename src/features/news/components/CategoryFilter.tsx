import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '../hooks/use-news'

interface CategoryFilterProps {
  selectedCategory?: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  className 
}: CategoryFilterProps) {
  const { data, isLoading, isError } = useCategories({
    is_active: true,
    limit: 20,
  })

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data?.categories.length) {
    return null
  }

  return (
    <div className={className}>
      <h3 className="font-medium mb-3">Kategoriler</h3>
      
      <div className="flex flex-wrap gap-2">
        {/* Tümü seçeneği */}
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange('')}
          className="relative"
        >
          Tümü
          {!selectedCategory && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Aktif
            </Badge>
          )}
        </Button>

        {/* Kategori seçenekleri */}
        {data.categories.map((category: { id: string; name: string }) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="relative"
          >
            {category.name}
            {selectedCategory === category.id && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Aktif
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
} 