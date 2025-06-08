import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Ana sayfa bileşeni
 * Uygulamanın ana sayfasını render eder
 * Hero bölümü, örnek haberler ve istatistikler içerir
 * @returns Ana sayfa için JSX elementi
 */
export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">AI News Platform</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Yapay zeka tarafından oluşturulan en güncel haberler
        </p>
      </section>

      {/* Sample News Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Son Haberler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  Örnek Haber Başlığı {i} - AI Teknolojilerinde Yeni Gelişmeler
                </CardTitle>
                <CardDescription>
                  2 saat önce • Teknoloji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Bu bir örnek haber içeriğidir. Gerçek haberler RSS kaynaklarından 
                  çekilecek ve AI tarafından işlenecektir. Lorem ipsum dolor sit amet 
                  consectetur adipisicing elit.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">150+</CardTitle>
            <CardDescription>Günlük Haber</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">25+</CardTitle>
            <CardDescription>RSS Kaynağı</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">1000+</CardTitle>
            <CardDescription>Aktif Kullanıcı</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
} 