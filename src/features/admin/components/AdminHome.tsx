import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Activity,
  Shield,
  Rss
} from 'lucide-react'

// Admin ana sayfası bileşeni
// Admin panelinin genel görünümünü ve hızlı erişim linklerini sağlar
export function AdminHome() {
  const adminStats = [
    { title: 'Toplam Kullanıcı', value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: 'Aktif Haberler', value: '567', icon: FileText, color: 'text-green-600' },
    { title: 'Günlük Ziyaret', value: '8,901', icon: BarChart3, color: 'text-purple-600' },
    { title: 'Sistem Durumu', value: 'Aktif', icon: Activity, color: 'text-emerald-600' },
  ]

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

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Paneli</h1>
        <p className="text-muted-foreground">
          Sistem yönetimi ve genel bakış
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => {
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
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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

      {/* Son Aktiviteler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            Sistemdeki son işlemler ve değişiklikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">10:30</span>
              <span>Yeni kullanıcı kaydı: john_doe</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">09:15</span>
              <span>Sistem güncellemesi tamamlandı</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-muted-foreground">08:45</span>
              <span>Backup işlemi başlatıldı</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 