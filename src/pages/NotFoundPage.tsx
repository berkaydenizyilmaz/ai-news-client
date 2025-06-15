import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { navigationService } from '@/lib/navigation-service'

/**
 * 404 sayfa bulunamadı bileşeni
 * Geçersiz rotalar için kullanıcı dostu bir hata sayfası sağlar
 * Ana sayfaya dönüş ve geri gitme seçenekleri içerir
 * @returns 404 hata sayfası için JSX elementi
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
          <CardTitle>Sayfa Bulunamadı</CardTitle>
          <CardDescription>
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link to="/">Ana Sayfaya Dön</Link>
            </Button>
            <Button variant="outline" onClick={() => navigationService.goBack()} className="flex-1">
              Geri Git
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 

export default NotFoundPage 