import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  ChevronLeft,
  Shield,
  Rss,
  Newspaper
} from 'lucide-react'

interface AdminSidebarProps {
  className?: string
}

const sidebarItems = [
  {
    title: 'Ana Sayfa',
    href: '/admin',
    icon: Home,
    exact: true
  },
  {
    title: 'Haber Yönetimi',
    href: '/admin/news',
    icon: Newspaper
  },
  {
    title: 'RSS Kaynakları',
    href: '/admin/rss',
    icon: Rss
  },
  {
    title: 'İstatistikler',
    href: '/admin/stats',
    icon: BarChart3
  },
  {
    title: 'Kullanıcılar',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Loglar',
    href: '/admin/logs',
    icon: FileText
  },
  {
    title: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
]

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-lg">Admin Panel</span>
          )}
        </div>
        
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto hidden lg:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-lg py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground relative group",
                  active && "bg-accent text-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          to="/"
          className={cn(
            "flex items-center rounded-lg py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground relative group",
            isCollapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
          title={isCollapsed ? "Ana Siteye Dön" : undefined}
        >
          <Home className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Ana Siteye Dön</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Ana Siteye Dön
            </div>
          )}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex h-full bg-card border-r transition-all duration-300",
        isCollapsed ? "w-24" : "w-64",
        className
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>
    </>
  )
} 