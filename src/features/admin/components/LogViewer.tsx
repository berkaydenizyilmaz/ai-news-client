import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useLogs } from '../services/log-api'
import { useErrorHandler } from '@/hooks/use-error-handler'
import type { LogQuery, LogLevel, LogModule } from '../types'
import { Search, AlertTriangle, Info, Bug, ChevronLeft, ChevronRight } from 'lucide-react'

// Log seviyesi için renk ve ikon eşleştirmesi
const logLevelConfig = {
  info: { color: 'bg-blue-500', icon: Info, label: 'Bilgi' },
  warning: { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Uyarı' },
  warn: { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Uyarı' }, // Backward compatibility
  error: { color: 'bg-red-500', icon: AlertTriangle, label: 'Hata' },
  debug: { color: 'bg-gray-500', icon: Bug, label: 'Debug' },
} as const

// Modül etiketleri
const moduleLabels: Record<LogModule, string> = {
  auth: 'Auth',
  rss: 'RSS',
  news: 'News',
  settings: 'Settings',
  forum: 'Forum',
  users: 'Users',
  reports: 'Reports',
  notification: 'Notifications',
}

// Kompakt log görüntüleme ve yönetim bileşeni
export function LogViewer () {
  const [filters, setFilters] = useState<LogQuery>({
    page: 1,
    limit: 50,
  })

  const { data: logsData, isLoading, error } = useLogs(filters)
  const { handleError } = useErrorHandler()

  const logs = logsData?.data?.logs || []
  const pagination = logsData?.data?.pagination


  // Filtreleri günceller - hata düzeltildi
  const updateFilter = (key: keyof LogQuery, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' || value === 'all' ? undefined : value,
      page: key !== 'page' ? 1 : (typeof value === 'number' ? value : 1),
    }))
  }
    
  // Kompakt tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Şimdi'
    if (diffMins < 60) return `${diffMins}dk önce`
    if (diffHours < 24) return `${diffHours}sa önce`
    if (diffDays < 7) return `${diffDays}g önce`
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
  }

  if (error) {
    const errorMessage = handleError(error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Kompakt Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sistem Logları</h1>
          <p className="text-sm text-muted-foreground">
            {pagination?.total || 0} kayıt
          </p>
        </div>
      </div>

      {/* Kompakt Filtreler */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[120px]">
            <Select
              value={filters.level || undefined}
              onValueChange={(value) => updateFilter('level', value as LogLevel)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seviye" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="info">Bilgi</SelectItem>
                <SelectItem value="warning">Uyarı</SelectItem>
                <SelectItem value="error">Hata</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[120px]">
            <Select
              value={filters.module || undefined}
              onValueChange={(value) => updateFilter('module', value as LogModule)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Modül" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {Object.entries(moduleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="date"
            className="h-9 w-auto"
            value={filters.start_date || ''}
            onChange={(e) => updateFilter('start_date', e.target.value)}
          />

          <Input
            type="date"
            className="h-9 w-auto"
            value={filters.end_date || ''}
            onChange={(e) => updateFilter('end_date', e.target.value)}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ page: 1, limit: 50 })}
          >
            Temizle
          </Button>
        </div>
      </Card>

      {/* Kompakt Log Listesi */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Log bulunamadı</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => {
                const levelConfig = logLevelConfig[log.level]
                const LevelIcon = levelConfig.icon

                return (
                  <div
                    key={log.id}
                    className="p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Seviye Badge */}
                      <Badge 
                        variant="secondary" 
                        className={`${levelConfig.color} text-white shrink-0 h-5 px-1.5 text-xs`}
                      >
                        <LevelIcon className="h-3 w-3" />
                      </Badge>

                      {/* Ana İçerik */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {moduleLabels[log.module]}
                          </Badge>
                          {log.action && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {log.action}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.created_at)}
                          </span>
                          {log.user_id && (
                            <span className="text-xs text-muted-foreground">
                              User: {log.user_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                          {log.message}
                        </p>
                        
                         {log.metadata && Object.keys(log.metadata).length > 0 && (
                           <div className="text-xs text-muted-foreground mt-1">
                             <span className="font-medium">Metadata: </span>
                             <span className="font-mono bg-muted px-1 rounded">
                               {JSON.stringify(log.metadata, null, 0)}
                             </span>
                           </div>
                         )}
                      </div>


                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kompakt Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sayfa {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('page', pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('page', pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 