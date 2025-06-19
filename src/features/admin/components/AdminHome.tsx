import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Activity,
  Shield,
  Rss,
  AlertCircle
} from 'lucide-react'
import { useNewsStatistics, useCommentStatistics } from '@/features/news'
import { useUsersStatistics } from '../hooks/use-users'
import { useLogStats } from '../services/log-api'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Admin ana sayfası bileşeni
// Admin panelinin genel görünümünü ve hızlı erişim linklerini sağlar
export function AdminHome() {
  // Statistics queries
  const { data: newsStats, isLoading: newsLoading } = useNewsStatistics()
  const { data: userStats, isLoading: usersLoading } = useUsersStatistics()
  const { data: logStats, isLoading: logLoading } = useLogStats()
  const { data: commentStats, isLoading: commentLoading } = useCommentStatistics()

  // Error state
  const hasError = !newsStats && !userStats && !logStats && !commentStats

  const quickActions = [
    {
      title: 'RSS Kaynakları',
      description: 'RSS kaynaklarını yönet ve beslemeleri çek',
      href: '/admin/rss',
      icon: Rss,
      color: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900'
    },
    {
      title: 'Log Görüntüleyici',
      description: 'Sistem loglarını görüntüle ve analiz et',
      href: '/admin/logs',
      icon: FileText,
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900'
    },
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları yönet ve izinleri düzenle',
      href: '/admin/users',
      icon: Users,
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Uygulama ayarlarını yapılandır',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900'
    },
    {
      title: 'Güvenlik',
      description: 'Güvenlik ayarları ve izleme',
      href: '/admin/security',
      icon: Shield,
      color: 'bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900'
    }
  ]

  // İstatistik kartları - gerçek API verilerine dayalı
  const getAdminStats = () => {
    return [
      { 
        title: 'Toplam Kullanıcı', 
        value: userStats?.data?.total?.toString() || '0', 
        icon: Users, 
        color: 'text-blue-600',
        loading: usersLoading,
        error: !userStats
      },
      { 
        title: 'Aktif Haberler', 
        value: newsStats?.published_news?.toString() || '0', 
        icon: FileText, 
        color: 'text-green-600',
        loading: newsLoading,
        error: !newsStats
      },
      { 
        title: 'Toplam Yorum', 
        value: commentStats?.total_comments?.toString() || '0', 
        icon: BarChart3, 
        color: 'text-purple-600',
        loading: commentLoading,
        error: !commentStats
      },
      { 
        title: 'Sistem Durumu', 
        value: 'Aktif', 
        icon: Activity, 
        color: 'text-emerald-600',
        loading: false,
        error: false
      },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Paneli</h1>
        <p className="text-muted-foreground">
          Sistem yönetimi ve genel bakış
        </p>
      </div>

      {/* Hata durumu */}
      {hasError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bazı istatistikler yüklenirken hata oluştu. Veriler güncel olmayabilir.
          </AlertDescription>
        </Alert>
      )}

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getAdminStats().map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : stat.error ? (
                  <div className="text-2xl font-bold text-muted-foreground">-</div>
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                {stat.error && (
                  <p className="text-xs text-destructive mt-1">Yüklenemedi</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Ek İstatistikler */}
      {(newsStats && !newsLoading) && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Haber Durumları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {newsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Yayında:</span>
                    <span className="font-medium text-green-600">{newsStats.published_news}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Beklemede:</span>
                    <span className="font-medium text-yellow-600">{newsStats.pending_news}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">İşleniyor:</span>
                    <span className="font-medium text-blue-600">{newsStats.processing_news}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reddedilen:</span>
                    <span className="font-medium text-red-600">{newsStats.rejected_news}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Performansı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {newsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ortalama Güven:</span>
                    <span className="font-medium">%{Math.round((newsStats.avg_confidence_score || 0) * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ortalama İşlem:</span>
                    <span className="font-medium">{Math.round(newsStats.processing_time_avg || 0)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam Kaynak:</span>
                    <span className="font-medium">{newsStats.total_sources}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kullanıcı Durumları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {usersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : userStats?.data ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aktif:</span>
                    <span className="font-medium text-green-600">{userStats.data.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pasif:</span>
                    <span className="font-medium text-gray-600">{userStats.data.inactive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam:</span>
                    <span className="font-medium">{userStats.data.total}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  Veri yüklenemedi
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yorum İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commentLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : commentStats ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aktif Yorumlar:</span>
                    <span className="font-medium text-green-600">{commentStats.active_comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bu Hafta:</span>
                    <span className="font-medium text-blue-600">{commentStats.comments_this_week}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bu Ay:</span>
                    <span className="font-medium text-purple-600">{commentStats.comments_this_month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Toplam:</span>
                    <span className="font-medium">{commentStats.total_comments}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  Veri yüklenemedi
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hızlı Erişim */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hızlı Erişim</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className={`transition-colors ${action.color}`}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={action.href}>
                      Erişim
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Son Aktiviteler - Log verilerinden */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            Sistemdeki son işlemler ve değişiklikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-12 h-4" />
                  <Skeleton className="flex-1 h-4" />
                </div>
              ))}
            </div>
          ) : logStats?.data ? (
            <div className="space-y-3">
              {logStats.data.recent_activity?.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-muted-foreground">{activity.date}</span>
                  <span>{activity.count} işlem gerçekleştirildi</span>
                </div>
              ))}
              
              {/* Log seviyeleri özeti */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Info: {logStats.data.logs_by_level?.info || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Warning: {logStats.data.logs_by_level?.warning || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Error: {logStats.data.logs_by_level?.error || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Debug: {logStats.data.logs_by_level?.debug || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Son aktivite verisi yüklenemedi
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 