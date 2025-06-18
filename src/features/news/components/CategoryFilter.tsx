import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Filter } from 'lucide-react'
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
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data?.categories?.length) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Kategoriler</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange('')}
            className="rounded-full h-9 px-4 relative"
          >
            {!selectedCategory && <Check className="w-3 h-3 mr-1" />}
            Tümü
          </Button>
          {isError && (
            <span className="text-sm text-muted-foreground flex items-center px-3 py-2">
              Kategoriler yüklenemedi
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Kategoriler</h3>
        {selectedCategory && (
          <Badge variant="secondary" className="text-xs">
            Filtrelendi
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Tümü seçeneği */}
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange('')}
          className="rounded-full h-9 px-4 relative transition-all duration-200 hover:scale-105"
        >
          {!selectedCategory && <Check className="w-3 h-3 mr-1" />}
          Tümü
        </Button>

        {/* Kategori seçenekleri */}
        {data.categories.map((category: { id: string; name: string }) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="rounded-full h-9 px-4 relative transition-all duration-200 hover:scale-105"
          >
            {selectedCategory === category.id && <Check className="w-3 h-3 mr-1" />}
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Active filter indicator */}
      {selectedCategory && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Aktif filtre:</span>
          <Badge variant="default" className="text-xs">
            {data.categories.find(cat => cat.id === selectedCategory)?.name || 'Bilinmeyen'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange('')}
            className="h-6 px-2 text-xs hover:text-destructive"
          >
            Temizle
          </Button>
        </div>
      )}
    </div>
  )
} 