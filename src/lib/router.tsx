import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/common/RootLayout'
import { HomePage } from '@/components/common/HomePage'
import { NotFoundPage } from '@/components/common/NotFoundPage'
import { LoginForm, RegisterForm } from '@/features/authentication'
import { AdminHome, LogViewer } from '@/features/admin'
import { requireAdmin, redirectIfAuthenticated } from './authLoader'

/**
 * React Router kullanarak uygulama yönlendirici yapılandırması
 * Tüm rotaları ve bunlara karşılık gelen bileşenleri tanımlar
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin',
        loader: requireAdmin,
        element: <AdminHome />,
      },
      {
        path: 'admin/logs',
        loader: requireAdmin,
        element: <LogViewer />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: 'login',
    loader: redirectIfAuthenticated,
    element: <LoginForm />,
  },
  {
    path: 'register',
    loader: redirectIfAuthenticated,
    element: <RegisterForm />,
  },
]) 