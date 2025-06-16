import { Outlet } from 'react-router-dom'
import { AdminLayout } from '@/features/admin'

// Admin Layout Wrapper - Outlet kullanarak child route'ları render eder
export const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
) 