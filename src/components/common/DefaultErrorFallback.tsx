import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Varsayılan hata fallback bileşeni props arayüzü
 */
interface DefaultErrorFallbackProps {
  /** Oluşan hata (opsiyonel) */
  error?: Error
  /** Hatayı sıfırlamak için fonksiyon */
  resetError: () => void
}

/**
 * Varsayılan hata fallback bileşeni
 * Error Boundary tarafından yakalanan hatalar için kullanıcı dostu bir arayüz sağlar
 * @param props - Bileşen props'ları
 * @returns Hata fallback UI için JSX elementi
 */
export function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">Bir Hata Oluştu</CardTitle>
          <CardDescription>
            Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya tekrar deneyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Hata detayları (geliştiriciler için)
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              Tekrar Dene
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="flex-1"
            >
              Sayfayı Yenile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 