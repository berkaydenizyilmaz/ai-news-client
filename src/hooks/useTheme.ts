import { useContext } from 'react'
import { ThemeProviderContext } from '@/lib/theme-context'  

/**
 * Tema context'ine erişim için özel hook
 * @returns Mevcut tema ve setter fonksiyonunu içeren tema context değeri
 * @throws ThemeProvider dışında kullanılırsa hata fırlatır
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
} 