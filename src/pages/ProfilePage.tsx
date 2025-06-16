import { useEffect } from 'react'
import { useProfile } from '@/features/authentication/services/auth-api'
import { ProfileForm } from '@/features/authentication/components/ProfileForm'
import { ChangePasswordForm } from '@/features/authentication/components/ChangePasswordForm'
import { useAuthStore } from '@/store/auth-store'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { AlertTriangle } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuthStore()
  const { data: profileData, isLoading, error, refetch } = useProfile()
  const { handleError } = useErrorHandler()

  // Sayfa yüklendiğinde profil verilerini getir
  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [user, refetch])

  const handleProfileUpdateSuccess = () => {
    // Profil güncellendiğinde verileri yenile (opsiyonel, auth store zaten güncel)
    // refetch()
  }

  const handlePasswordChangeSuccess = () => {
    // Şifre değiştirildiğinde başarı mesajı gösterilebilir
    // Toast notification burada eklenebilir
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    const errorMessage = handleError(error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  // Store'daki güncel user bilgisini kullan (profil güncellemelerinde otomatik güncellenir)
  const currentUser = user || profileData?.data

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Profil bilgileri yüklenemedi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground">
            Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profil Bilgileri */}
          <div>
            <ProfileForm 
              user={currentUser} 
              onSuccess={handleProfileUpdateSuccess}
            />
          </div>

          {/* Şifre Değiştirme */}
          <div>
            <ChangePasswordForm 
              onSuccess={handlePasswordChangeSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 