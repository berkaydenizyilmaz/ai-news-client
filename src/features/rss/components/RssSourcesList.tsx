import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, RefreshCw, ExternalLink, Calendar, Tag } from 'lucide-react';
import { useRssSources } from '../services/rss-api';
import { useRss } from '../hooks/use-rss';
import type { RssSourceQuery } from '../types';

interface RssSourcesListProps {
  onCreateClick?: () => void;
  onEditClick?: (id: string) => void;
}

export const RssSourcesList = ({ onCreateClick, onEditClick }: RssSourcesListProps) => {
  const [query, setQuery] = useState<RssSourceQuery>({
    page: 1,
    limit: 10,
    is_active: true,
  });
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useRssSources(query);
  const { fetchRssFeeds, isAdmin } = useRss();

  const handleSearch = () => {
    setQuery(prev => ({ ...prev, search: search.trim() || undefined, page: 1 }));
  };

  const handleFilterChange = (key: keyof RssSourceQuery, value: boolean | undefined) => {
    setQuery(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleFetchFeeds = async (sourceId?: string) => {
    try {
      await fetchRssFeeds.mutateAsync(sourceId ? { source_id: sourceId } : undefined);
    } catch (error) {
      console.error('RSS çekme hatası:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Hiç çekilmedi';
    return new Date(dateString).toLocaleString('tr-TR');
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          RSS kaynakları yüklenirken hata oluştu: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">RSS Kaynakları</h2>
          <p className="text-muted-foreground">
            Haber kaynaklarını yönetin ve RSS beslemelerini çekin
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleFetchFeeds()}
              disabled={fetchRssFeeds.isPending}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${fetchRssFeeds.isPending ? 'animate-spin' : ''}`} />
              Tümünü Çek
            </Button>
            {onCreateClick && (
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kaynak
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtreler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="RSS kaynağı ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={query.is_active === true ? 'default' : 'outline'}
                onClick={() => handleFilterChange('is_active', true)}
                size="sm"
              >
                Aktif
              </Button>
              <Button
                variant={query.is_active === false ? 'default' : 'outline'}
                onClick={() => handleFilterChange('is_active', false)}
                size="sm"
              >
                Pasif
              </Button>
              <Button
                variant={query.is_active === undefined ? 'default' : 'outline'}
                onClick={() => handleFilterChange('is_active', undefined)}
                size="sm"
              >
                Tümü
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* RSS Sources Grid */}
      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.sources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {source.name}
                        <Badge variant={source.is_active ? 'default' : 'secondary'}>
                          {source.is_active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </CardTitle>
                      {source.description && (
                        <CardDescription className="mt-1">
                          {source.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary truncate"
                    >
                      {source.url}
                    </a>
                  </div>

                  {source.category && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4" />
                      <Badge variant="outline">{source.category.name}</Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Son çekim: {formatDate(source.last_fetched_at)}</span>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFetchFeeds(source.id)}
                        disabled={fetchRssFeeds.isPending}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${fetchRssFeeds.isPending ? 'animate-spin' : ''}`} />
                        Çek
                      </Button>
                      {onEditClick && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditClick(source.id)}
                        >
                          Düzenle
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(data.pagination.current_page - 1)}
                disabled={!data.pagination.has_prev}
              >
                Önceki
              </Button>
              <span className="text-sm text-muted-foreground">
                Sayfa {data.pagination.current_page} / {data.pagination.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(data.pagination.current_page + 1)}
                disabled={!data.pagination.has_next}
              >
                Sonraki
              </Button>
            </div>
          )}

          {/* Empty State */}
          {data.sources.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {query.search ? 'Arama kriterlerinize uygun RSS kaynağı bulunamadı.' : 'Henüz RSS kaynağı eklenmemiş.'}
                </p>
                {isAdmin && onCreateClick && !query.search && (
                  <Button onClick={onCreateClick} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    İlk RSS Kaynağını Ekle
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}; 