import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuth } from '../hooks/use-auth'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-300 dark:bg-purple-700 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-300 dark:bg-cyan-700 rounded-full blur-xl opacity-45"></div>
        <div className="absolute top-1/6 right-1/6 w-32 h-32 bg-pink-300 dark:bg-pink-700 rounded-full blur-lg opacity-35"></div>
        <div className="absolute bottom-1/6 left-1/6 w-40 h-40 bg-emerald-300 dark:bg-emerald-700 rounded-full blur-xl opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-4 hover:scale-105 transition-transform">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">AI</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">AI News</h1>
            </div>
          </Link>
          <p className="text-muted-foreground text-lg">
            AI News hesabınızı oluşturun
          </p>
        </div>

        {/* Register Card */}
        <Card className="w-full shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <CardHeader className="text-center pb-4 relative">
            <CardTitle className="text-2xl font-semibold">Kayıt Ol</CardTitle>
            {/* Theme Toggle */}
            <div className="absolute top-0 right-0 mr-8">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Kullanıcı adınızı girin"
                  className="h-12 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-posta Adresi
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ornek@email.com"
                  className="h-12 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Şifrenizi girin (en az 6 karakter)"
                  className="h-12 px-4"
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isRegisterPending}
              >
                {isRegisterPending ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Giriş yapın
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © 2024 AI News. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  )
} 