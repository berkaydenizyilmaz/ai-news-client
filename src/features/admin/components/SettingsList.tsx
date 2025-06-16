import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings as SettingsIcon,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useSettings, useDeleteSetting } from '../services/settings-api';
import { useErrorHandler } from '@/hooks/use-error-handler';
import type { SettingsQuery } from '../services/settings-api';

interface SettingsListProps {
  onCreateClick?: () => void;
  onEditClick?: (key: string) => void;
}

// Settings listesi bileşeni
// Sistem ayarlarını listeler, filtreler ve yönetir
export const SettingsList = ({ onCreateClick, onEditClick }: SettingsListProps) => {
  const [query, setQuery] = useState<SettingsQuery>({});
  const [search, setSearch] = useState('');

  const { data: settings, isLoading, error, refetch } = useSettings(query);
  const deleteSetting = useDeleteSetting();
  const { handleError } = useErrorHandler();

  const handleSearch = () => {
    setQuery(prev => ({ ...prev, search: search.trim() || undefined }));
  };

  const handleFilterChange = (key: keyof SettingsQuery, value: string | undefined) => {
    setQuery(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Bu ayarı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteSetting.mutateAsync(key);
    } catch (error) {
      const errorMessage = handleError(error);
      alert(`Ayar silinirken hata oluştu: ${errorMessage}`);
    }
  };

  const formatValue = (value: string, type: string) => {
    if (type === 'json') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'number': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'boolean': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'json': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'rss': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'ai': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'auth': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'news': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'forum': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'email': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Ayarlar yüklenirken hata oluştu: {handleError(error)}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
          <p className="text-muted-foreground">
            Uygulama ayarlarını yönetin ve yapılandırın
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          {onCreateClick && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ayar
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Ayar ara (key, description)..."
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
              <Select
                value={query.category || 'all'}
                onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="rss">RSS</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="auth">Auth</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="forum">Forum</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={query.type || 'all'}
                onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Tipler</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Settings Grid */}
      {settings && settings.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settings.map((setting) => (
            <Card key={setting.key} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      {setting.key}
                    </CardTitle>
                    {setting.description && (
                      <CardDescription className="mt-1">
                        {setting.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Badge className={getTypeColor(setting.type)}>
                    {setting.type}
                  </Badge>
                  {setting.category && (
                    <Badge variant="outline" className={getCategoryColor(setting.category)}>
                      {setting.category}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Değer:</div>
                  <div className="text-sm bg-muted p-2 rounded border max-h-32 overflow-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {formatValue(setting.value, setting.type)}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {onEditClick && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditClick(setting.key)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Düzenle
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSetting(setting.key)}
                    disabled={deleteSetting.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {settings && settings.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <SettingsIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {query.search || query.category || query.type
                ? 'Filtrelere uygun ayar bulunamadı'
                : 'Henüz sistem ayarı eklenmemiş'
              }
            </p>
            {onCreateClick && (
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                İlk Ayarı Ekle
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 