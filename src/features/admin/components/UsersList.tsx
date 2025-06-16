import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  UserX,
  Crown,
  Shield,
  User,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useUsersManager } from '../hooks/use-users'
import { useErrorHandler } from '@/hooks/use-error-handler'
import type { GetUsersQuery, UserWithStats } from '../types'

// Kullanıcı listesi bileşeni
// Filtreleme, arama, pagination ve kullanıcı yönetimi işlemleri
export function UsersList() {
  const [filters, setFilters] = useState<GetUsersQuery>({
    limit: 10,
    offset: 0,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { useUsers, updateUserRole, updateUserStatus, deleteUser } = useUsersManager()
  const { data: usersData, isLoading, error } = useUsers(filters)
  const { handleError } = useErrorHandler()

  const users = usersData?.data?.users || []
  const pagination = usersData?.data?.pagination

  // Filtreleri güncelle
  const updateFilter = (key: keyof GetUsersQuery, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' || value === 'all' ? undefined : value,
      offset: key !== 'offset' ? 0 : value, // Filtre değiştiğinde ilk sayfaya dön
    }))
  }

  // Arama işlemi
  const handleSearch = () => {
    updateFilter('search', searchTerm.trim() || undefined)
  }

  // Sayfa değiştirme
  const handlePageChange = (newOffset: number) => {
    updateFilter('offset', newOffset)
  }

  // Rol değiştirme
  const handleRoleChange = async (userId: string, newRole: 'visitor' | 'user' | 'moderator' | 'admin') => {
    if (confirm(`Bu kullanıcının rolünü ${getRoleLabel(newRole)} olarak değiştirmek istediğinizden emin misiniz?`)) {
      await updateUserRole.mutateAsync(userId, { role: newRole })
    }
  }

  // Durum değiştirme
  const handleStatusChange = async (userId: string, isActive: boolean) => {
    const action = isActive ? 'aktif' : 'pasif'
    if (confirm(`Bu kullanıcıyı ${action} yapmak istediğinizden emin misiniz?`)) {
      await updateUserStatus.mutateAsync(userId, { is_active: isActive })
    }
  }

  // Kullanıcı silme
  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      await deleteUser.mutateAsync(userId)
    }
  }

  // Yardımcı fonksiyonlar
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown
      case 'moderator': return Shield
      case 'user': return User
      default: return Eye
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Yönetici'
      case 'moderator': return 'Moderatör'
      case 'user': return 'Kullanıcı'
      case 'visitor': return 'Ziyaretçi'
      default: return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500'
      case 'moderator': return 'bg-orange-500'
      case 'user': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (error) {
    const errorMessage = handleError(error)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-muted-foreground">
            {pagination?.total || 0} kullanıcı
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Arama</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Email veya kullanıcı adı..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button size="sm" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rol Filtresi */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <Select
                value={filters.role || 'all'}
                onValueChange={(value) => updateFilter('role', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm roller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm roller</SelectItem>
                  <SelectItem value="admin">Yönetici</SelectItem>
                  <SelectItem value="moderator">Moderatör</SelectItem>
                  <SelectItem value="user">Kullanıcı</SelectItem>
                  <SelectItem value="visitor">Ziyaretçi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Durum Filtresi */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Durum</label>
              <Select
                value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
                onValueChange={(value) => updateFilter('is_active', value === 'all' ? undefined : value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm durumlar</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sıralama */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sıralama</label>
              <Select
                value={filters.sort || 'created_at'}
                onValueChange={(value) => updateFilter('sort', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Kayıt Tarihi</SelectItem>
                  <SelectItem value="updated_at">Güncelleme Tarihi</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="username">Kullanıcı Adı</SelectItem>
                  <SelectItem value="role">Rol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({ limit: 10, offset: 0 })
                setSearchTerm('')
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kullanıcı Listesi */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user: UserWithStats) => {
                const RoleIcon = getRoleIcon(user.role)
                
                return (
                  <div key={user.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* Kullanıcı Bilgileri */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {getUserInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.username}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`${getRoleBadgeColor(user.role)} text-white`}
                            >
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {getRoleLabel(user.role)}
                            </Badge>
                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                              {user.is_active ? (
                                <UserCheck className="h-3 w-3 mr-1" />
                              ) : (
                                <UserX className="h-3 w-3 mr-1" />
                              )}
                              {user.is_active ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Kayıt: {formatDate(user.created_at)}</span>
                            <span>Yorumlar: {user.comment_count}</span>
                            <span>Forum: {user.forum_post_count}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kontroller */}
                      <div className="flex items-center gap-2">
                        {/* Rol Değiştirme */}
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as any)}
                          disabled={updateUserRole.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor">Ziyaretçi</SelectItem>
                            <SelectItem value="user">Kullanıcı</SelectItem>
                            <SelectItem value="moderator">Moderatör</SelectItem>
                            <SelectItem value="admin">Yönetici</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Durum Değiştirme */}
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                            disabled={updateUserStatus.isPending}
                          />
                          <span className="text-sm text-muted-foreground">
                            {user.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>

                        {/* Silme */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUser.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.has_more && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} / {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
              disabled={pagination.offset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.offset + pagination.limit)}
              disabled={!pagination.has_more}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 