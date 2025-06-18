import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, SortAsc, SortDesc } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface NewsSearchProps {
  search: string
  sortBy: 'published_at' | 'view_count'
  sortOrder: 'asc' | 'desc'
  onSearchChange: (search: string) => void
  onSortChange: (sortBy: 'published_at' | 'view_count', sortOrder: 'asc' | 'desc') => void
  onReset: () => void
  className?: string
}

export function NewsSearch({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
  onReset,
  className
}: NewsSearchProps) {
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 500)

  // Debounced search değeri değiştiğinde parent'ı güncelle
  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  // Parent'tan gelen search değeri değiştiğinde local state'i güncelle
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  const handleClearSearch = () => {
    setLocalSearch('')
    onSearchChange('')
  }

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Arama kutusu */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Haberlerde ara..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Sıralama seçenekleri */}
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value: 'published_at' | 'view_count') => 
              onSortChange(value, sortOrder)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published_at">Tarihe Göre</SelectItem>
              <SelectItem value="view_count">Popülerliğe Göre</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={sortOrder === 'desc' ? 'Azalan Sıralama' : 'Artan Sıralama'}
          >
            {sortOrder === 'desc' ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <SortAsc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filtreleri temizle */}
        {(localSearch || sortBy !== 'published_at' || sortOrder !== 'desc') && (
          <Button variant="outline" onClick={onReset}>
            Temizle
          </Button>
        )}
      </div>
    </div>
  )
} 