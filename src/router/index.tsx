import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/router/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import { ProfilePage } from '@/pages/ProfilePage'
import AdminHomePage from '@/pages/admin/AdminHomePage'
import LogViewerPage from '@/pages/admin/LogViewerPage'
import { RssPage } from '@/pages/admin/RssPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { requireAuth, requireAdmin, redirectIfAuthenticated } from './auth-loader'
import { AdminLayoutWrapper } from './AdminLayoutWrapper'

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
        path: 'profile',
        loader: requireAuth,
        element: <ProfilePage />,
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
    element: <AdminLayoutWrapper />,
    children: [
      {
        index: true,
        element: <AdminHomePage />,
      },
      {
        path: 'logs',
        element: <LogViewerPage />,
      },
      {
        path: 'rss',
        element: <RssPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
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
]) 