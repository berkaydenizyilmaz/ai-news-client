import { createContext } from 'react'

// Mevcut tema seçenekleri
export type Theme = 'dark' | 'light' | 'system'

// Tema sağlayıcısı durum arayüzü
export interface ThemeProviderState {
  // Mevcut aktif tema
  theme: Theme
  // Temayı güncellemek için fonksiyon
  setTheme: (theme: Theme) => void
}

// Tema sağlayıcısı için başlangıç durumu
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

// Tema yönetimi için React context'i
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState) 