import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/common/RootLayout'
import { HomePage } from '@/components/common/HomePage'
import { NotFoundPage } from '@/components/common/NotFoundPage'
import { LoginForm, RegisterForm } from '@/features/authentication'

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
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
      {
        path: 'admin',
        element: <div>Admin Panel</div>,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]) 