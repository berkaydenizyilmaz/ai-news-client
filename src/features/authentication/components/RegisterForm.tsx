import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../hooks/useAuth'
import type { RegisterRequest } from '../types'

/**
 * Kayıt formu bileşeni
 * Kullanıcı adı, e-posta ve şifre ile kullanıcı kaydı arayüzü sağlar
 * @returns Kayıt formu için JSX elementi
 */
export function RegisterForm() {
  const navigate = useNavigate()
  const { register, isRegisterPending } = useAuth()
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    username: '',
  })
  const [error, setError] = useState<string>('')

  /**
   * Kullanıcı kaydı için form gönderimini işler
   * @param e - Form gönderim olayı
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await register(formData)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Kayıt başarısız')
    }
  }

  /**
   * Input alanı değişikliklerini işler
   * @param e - Input değişiklik olayı
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>
            Yeni hesap oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="kullaniciadi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ornek@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isRegisterPending}
            >
              {isRegisterPending ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
              <Link to="/login" className="text-primary hover:underline">
                Giriş yapın
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 