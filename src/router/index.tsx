import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/common/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import { ProfilePage } from '@/pages/ProfilePage'
import AdminHomePage from '@/pages/admin/AdminHomePage'
import LogViewerPage from '@/pages/admin/LogViewerPage'
import { RssPage } from '@/pages/admin/RssPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import { requireAuth, requireAdmin, redirectIfAuthenticated } from './auth-loader'

// React Router kullanarak uygulama yönlendirici yapılandırması
// Tüm rotaları ve bunlara karşılık gelen bileşenleri tanımlar
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: 'admin',
    loader: requireAdmin,
    element: <AdminHomePage />,
  },
  {
    path: 'admin/logs',
    loader: requireAdmin,
    element: <LogViewerPage />,
  },
  {
    path: 'admin/rss',
    loader: requireAdmin,
    element: <RssPage />,
  },
  {
    path: 'admin/settings',
    loader: requireAdmin,
    element: <SettingsPage />,
  },
  {
    path: 'login',
    loader: redirectIfAuthenticated,
    element: <LoginPage />,
  },
  {
    path: 'register',
    loader: redirectIfAuthenticated,
    element: <RegisterPage />,
  },
  {
    path: 'profile',
    loader: requireAuth,
    element: <ProfilePage />,
  },
]) 