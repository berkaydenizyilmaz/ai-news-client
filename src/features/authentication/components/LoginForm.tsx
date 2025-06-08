import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../hooks/useAuth'
import type { LoginRequest } from '../types'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoginPending } = useAuth()
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await login(formData)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Giriş başarısız')
    }
  }

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
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapın
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoginPending}
            >
              {isLoginPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Hesabınız yok mu? </span>
              <Link to="/register" className="text-primary hover:underline">
                Kayıt olun
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 