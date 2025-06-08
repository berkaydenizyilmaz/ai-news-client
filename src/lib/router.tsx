import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/common/RootLayout'
import { HomePage } from '@/components/common/HomePage'

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
        element: <div>Login Sayfası</div>,
      },
      {
        path: 'register',
        element: <div>Register Sayfası</div>,
      },
      {
        path: 'admin',
        element: <div>Admin Panel</div>,
      },
    ],
  },
]) 