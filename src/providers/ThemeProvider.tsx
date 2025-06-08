import { useEffect, useState } from 'react'
import { ThemeProviderContext, type Theme } from '@/lib/theme-context'

/**
 * ThemeProvider bileşeni için props
 */
interface ThemeProviderProps {
  /** Tema context'i ile sarmalanacak alt bileşenler */
  children: React.ReactNode
  /** Hiçbiri saklanmamışsa kullanılacak varsayılan tema */
  defaultTheme?: Theme
  /** Tema kalıcılığı için localStorage anahtarı */
  storageKey?: string
}

/**
 * Tema sağlayıcısı bileşeni
 * Tema durumunu yönetir ve belge köküne tema sınıfları uygular
 * localStorage kalıcılığı ile açık, koyu ve sistem temalarını destekler
 * @param props - Bileşen props'ları
 * @returns Tema context sağlayıcısı ile JSX elementi
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

