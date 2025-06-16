import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from '@/providers/AppProviders'

// Uygulamanın giriş noktası
// React uygulamasını DOM'a mount eder ve tüm sağlayıcıları başlatır

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
