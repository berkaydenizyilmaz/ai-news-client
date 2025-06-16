import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateProfile } from '../services/auth-api'
import { useErrorHandler } from '@/hooks/use-error-handler'
import type { User, UpdateProfileRequest } from '../types'
import { User as UserIcon, Mail, AtSign, Image } from 'lucide-react'

// Profil güncelleme form şeması
const profileSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır').max(50, 'Kullanıcı adı en fazla 50 karakter olabilir').optional().or(z.literal('')),
  avatar_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal(''))
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: User
  onSuccess?: () => void
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const updateProfileMutation = useUpdateProfile()
  const { handleError } = useErrorHandler()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
      avatar_url: user.avatar_url || ''
    }
  })

  const avatarUrl = watch('avatar_url')

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Boş string'leri undefined'a çevir ve sadece değişen alanları gönder
      const updateData: UpdateProfileRequest = {}
      
      if (data.email && data.email !== user.email) {
        updateData.email = data.email
      }
      if (data.username && data.username !== user.username) {
        updateData.username = data.username
      }
      if (data.avatar_url !== user.avatar_url) {
        updateData.avatar_url = data.avatar_url || undefined
      }

      // Eğer hiçbir değişiklik yoksa işlem yapma
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      await updateProfileMutation.mutateAsync(updateData)
      setIsEditing(false)
      onSuccess?.()
    } catch (error) {
      handleError(error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500'
      case 'moderator': return 'bg-orange-500'
      case 'user': return 'bg-blue-500'
      default: return 'bg-gray-500'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Profil Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar ve Temel Bilgiler */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || user.avatar_url || undefined} />
            <AvatarFallback className="text-lg">
              {getUserInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{user.username}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.is_active ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* E-posta */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-posta Adresi
            </Label>
            <Input
              id="email"
              type="email"
              disabled={!isEditing}
              {...register('email')}
              className={!isEditing ? 'bg-muted' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Kullanıcı Adı */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              Kullanıcı Adı
            </Label>
            <Input
              id="username"
              disabled={!isEditing}
              {...register('username')}
              className={!isEditing ? 'bg-muted' : ''}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="avatar_url" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Avatar URL
            </Label>
            <Input
              id="avatar_url"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              disabled={!isEditing}
              {...register('avatar_url')}
              className={!isEditing ? 'bg-muted' : ''}
            />
            {errors.avatar_url && (
              <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
            )}
          </div>

          {/* Hesap Bilgileri */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</Label>
              <p className="text-sm">{new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Son Güncelleme</Label>
              <p className="text-sm">{new Date(user.updated_at).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Düzenle
              </Button>
            ) : (
              <>
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending || !isDirty}
                >
                  {updateProfileMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                >
                  İptal
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 