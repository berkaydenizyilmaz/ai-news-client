import { type ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
  className?: string
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <main className={cn(
        "flex-1 overflow-auto",
        className
      )}>
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 