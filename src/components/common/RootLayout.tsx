import { Outlet } from 'react-router-dom'
import { Header } from '@/components/common/Header'

/**
 * Kök layout bileşeni
 * Uygulamanın ana layout yapısını sağlar (header, main, footer)
 * React Router Outlet ile alt rotaları render eder
 * @returns Ana layout yapısı için JSX elementi
 */
export function RootLayout() {
  return (
    <div className="min-h-screen min-w-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t py-6 w-full">
        <div className="container mx-auto px-4 text-center text-muted-foreground max-w-7xl">
          <p>&copy; 2024 AI News Platform. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
} 