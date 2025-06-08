import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl">News Platform</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/categories" className="text-foreground/60 hover:text-foreground transition-colors">
              Kategoriler
            </Link>
            <Link to="/forum" className="text-foreground/60 hover:text-foreground transition-colors">
              Forum
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-foreground/60 hover:text-foreground transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Hoş geldin, {user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Giriş</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Kayıt Ol</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 