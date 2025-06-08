import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useLogs, useDeleteLog } from '../services/logApi'
import type { LogQuery, LogLevel, LogModule } from '../types'
import { Trash2, Search, Filter, Calendar, User, AlertTriangle, Info, Bug } from 'lucide-react'

/**
 * Log seviyesi için renk ve ikon eşleştirmesi
 */
const logLevelConfig = {
  info: { color: 'bg-blue-500', icon: Info, label: 'Bilgi' },
  warn: { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Uyarı' },
  error: { color: 'bg-red-500', icon: AlertTriangle, label: 'Hata' },
  debug: { color: 'bg-gray-500', icon: Bug, label: 'Debug' },
} as const

/**
 * Modül etiketleri
 */
const moduleLabels: Record<LogModule, string> = {
  auth: 'Kimlik Doğrulama',
  rss: 'RSS',
  news: 'Haberler',
  settings: 'Ayarlar',
  forum: 'Forum',
  users: 'Kullanıcılar',
  reports: 'Raporlar',
  notification: 'Bildirimler',
}

/**
 * Log görüntüleme ve yönetim bileşeni
 * Log listesi, filtreleme ve silme işlemlerini sağlar
 * @returns Log viewer için JSX elementi
 */
export function LogViewer() {
  const [filters, setFilters] = useState<LogQuery>({
    page: 1,
    limit: 20,
  })

  const { data: logsData, isLoading, error } = useLogs(filters)
  const deleteLogMutation = useDeleteLog()

  const logs = logsData?.data?.logs || []
  const pagination = logsData?.data?.pagination

  /**
   * Filtreleri günceller
   * @param key - Filtre anahtarı
   * @param value - Filtre değeri
   */
     const updateFilter = (key: keyof LogQuery, value: string | number | undefined) => {
     setFilters(prev => ({
       ...prev,
       [key]: value || undefined,
       page: key !== 'page' ? 1 : (typeof value === 'number' ? value : 1), // Sayfa dışındaki filtreler değiştiğinde ilk sayfaya dön
     }))
   }

  /**
   * Log silme işlemi
   * @param logId - Silinecek log ID'si
   */
  const handleDeleteLog = async (logId: string) => {
    if (confirm('Bu log kaydını silmek istediğinizden emin misiniz?')) {
      await deleteLogMutation.mutateAsync(logId)
    }
  }

  /**
   * Tarihi formatlar
   * @param dateString - ISO tarih string'i
   * @returns Formatlanmış tarih
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Loglar yüklenirken hata oluştu</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Log Yönetimi</h1>
        <p className="text-muted-foreground">
          Sistem loglarını görüntüle, filtrele ve yönet
        </p>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
          <CardDescription>
            Logları filtrelemek için aşağıdaki seçenekleri kullanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Seviye</Label>
              <Select
                value={filters.level || ''}
                onValueChange={(value) => updateFilter('level', value as LogLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm seviyeler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm seviyeler</SelectItem>
                  <SelectItem value="info">Bilgi</SelectItem>
                  <SelectItem value="warn">Uyarı</SelectItem>
                  <SelectItem value="error">Hata</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Modül</Label>
              <Select
                value={filters.module || ''}
                onValueChange={(value) => updateFilter('module', value as LogModule)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm modüller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm modüller</SelectItem>
                  {Object.entries(moduleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Başlangıç Tarihi</Label>
              <Input
                id="start_date"
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => updateFilter('start_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Bitiş Tarihi</Label>
              <Input
                id="end_date"
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => updateFilter('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilters({ page: 1, limit: 20 })}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Loglar
            </span>
            {pagination && (
              <span className="text-sm text-muted-foreground">
                {pagination.total_items} kayıt bulundu
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loglar yükleniyor...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2" />
              <p>Hiç log kaydı bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const levelConfig = logLevelConfig[log.level]
                const LevelIcon = levelConfig.icon

                return (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={`${levelConfig.color} text-white`}>
                            <LevelIcon className="h-3 w-3 mr-1" />
                            {levelConfig.label}
                          </Badge>
                          <Badge variant="outline">
                            {moduleLabels[log.module]}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(log.created_at)}
                          </span>
                          {log.user_id && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.user_id}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{log.message}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Metadata ({Object.keys(log.metadata).length} alan)
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLog(log.id)}
                        disabled={deleteLogMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sayfalama */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Sayfa {pagination.current_page} / {pagination.total_pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => updateFilter('page', pagination.current_page - 1)}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => updateFilter('page', pagination.current_page + 1)}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 