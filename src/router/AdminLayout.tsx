import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../features/admin/components/AdminSidebar'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  className?: string
}

export function AdminLayout({ className }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <main className={cn(
        "flex-1 overflow-auto",
        className
      )}>
        <div className="container mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 