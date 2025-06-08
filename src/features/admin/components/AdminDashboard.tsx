import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogStats } from '../services/logApi'
import { Activity, AlertTriangle, Info, Bug, Users, Settings } from 'lucide-react'

/**
 * Admin ana sayfa bileşeni
 * Sistem genel durumu ve hızlı erişim linklerini gösterir
 * @returns Admin dashboard için JSX elementi
 */
export function AdminDashboard() {
  const { data: logStats, isLoading } = useLogStats({ days: 7 })

  const stats = logStats?.data

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Paneli</h1>
        <p className="text-muted-foreground">
          Sistem yönetimi ve izleme araçları
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Log</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.total_logs.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Son 7 günde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hata Logları</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {isLoading ? '...' : stats?.by_level.error.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Kritik hatalar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bilgi Logları</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {isLoading ? '...' : stats?.by_level.info.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Genel bilgiler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debug Logları</CardTitle>
            <Bug className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {isLoading ? '...' : stats?.by_level.debug.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Geliştirici logları
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hızlı Erişim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Yönetimi
            </CardTitle>
            <CardDescription>
              Sistem loglarını görüntüle, filtrele ve yönet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/admin/logs">Log Sayfasına Git</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kullanıcı Yönetimi
            </CardTitle>
            <CardDescription>
              Kullanıcıları görüntüle ve yönet (Yakında)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Yakında Gelecek
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Sistem Ayarları
            </CardTitle>
            <CardDescription>
              Uygulama ayarlarını düzenle (Yakında)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Yakında Gelecek
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              RSS Yönetimi
            </CardTitle>
            <CardDescription>
              RSS kaynaklarını yönet (Yakında)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Yakında Gelecek
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 