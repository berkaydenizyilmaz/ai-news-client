import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { useHomePageNews, NewsCard } from '@/features/news'

// Kategori ikonları
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'teknoloji': '💻',
    'spor': '⚽',
    'siyaset': '🏛️',
    'ekonomi': '💰',
    'sağlık': '🏥',
    'eğitim': '📚',
    'kültür': '🎭',
    'sanat': '🎨',
    'müzik': '🎵',
    'sinema': '🎬',
    'bilim': '🔬',
    'çevre': '🌍',
    'otomobil': '🚗',
    'moda': '👗',
    'yemek': '🍽️',
    'seyahat': '✈️',
    'emlak': '🏠',
    'gündem': '📰',
    'dünya': '🌎',
    'yerel': '🏘️'
  }
  
  const normalizedName = categoryName.toLowerCase().trim()
  return iconMap[normalizedName] || '📋'
}

// Ana sayfa bileşeni
// Uygulamanın ana sayfasını render eder
// Hero bölümü, gerçek haberler ve istatistikler içerir
function HomePage() {
  const navigate = useNavigate()
  const { latestNews, categories, statistics, isLoading, isError, refetch } = useHomePageNews()

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/news?category=${categoryId}`)
  }

  const handleViewAllNews = () => {
    navigate('/news')
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        
        <div className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Breaking News Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              CANLI HABERLER
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              AI NEWS
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Yapay zeka destekli haber platformu. Güvenilir kaynaklardan derlenen, 
              objektif analiz edilen ve gerçek zamanlı güncellenen haberler.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl" onClick={handleViewAllNews}>
                Haberleri Keşfet
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl" onClick={() => navigate('/news?sort=view_count')}>
                <TrendingUp className="mr-2 h-6 w-6" />
                Trend Haberler
              </Button>
            </div>
            
            {/* Live Stats */}
            {statistics && (
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{statistics.published_news}</span>
                  <span className="text-sm text-muted-foreground">Aktif Haber</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{statistics.total_sources}</span>
                  <span className="text-sm text-muted-foreground">Kaynak</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">%{Math.round((statistics.avg_confidence_score || 0) * 100)}</span>
                  <span className="text-sm text-muted-foreground">AI Güven</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Haber Kategorileri</h2>
          <p className="text-muted-foreground">İlgilendiğiniz konulara göre haberleri keşfedin</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category: { id: string; name: string }) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group p-6 rounded-xl border-2 border-muted hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <span className="text-2xl">
                      {getCategoryIcon(category.name)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {/* Son Haberler */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Son Haberler</h2>
            <p className="text-muted-foreground">En güncel gelişmeler ve haberler</p>
          </div>
          <Button variant="ghost" onClick={handleViewAllNews} className="hidden md:flex">
            Tümünü Gör
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] rounded-xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold mb-2">Haberler yüklenemedi</h3>
            <p className="text-muted-foreground mb-6">Bir hata oluştu, lütfen tekrar deneyin</p>
            <Button onClick={refetch} variant="outline" size="lg">
              Tekrar Dene
            </Button>
          </div>
        ) : latestNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onClick={() => navigate(`/news/${news.slug}`)}
                />
              ))}
            </div>
            
            {/* Mobile "Tümünü Gör" butonu */}
            <div className="text-center mt-8 md:hidden">
              <Button onClick={handleViewAllNews} size="lg">
                Tüm Haberleri Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold mb-2">Henüz haber yok</h3>
            <p className="text-muted-foreground">Yakında haberler burada görünecek</p>
          </div>
        )}
      </section>

      {/* İstatistikler */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Platform İstatistikleri</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : statistics ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  {statistics.published_news}
                </CardTitle>
                <CardDescription>Yayında Haber</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  {statistics.categories_count}
                </CardTitle>
                <CardDescription>Kategori</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  {statistics.total_sources}
                </CardTitle>
                <CardDescription>Kaynak</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  %{Math.round((statistics.avg_confidence_score || 0) * 100)}
                </CardTitle>
                <CardDescription>Ortalama AI Güven</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">-</CardTitle>
                <CardDescription>Yayında Haber</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">-</CardTitle>
                <CardDescription>Kategori</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">-</CardTitle>
                <CardDescription>Kaynak</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">-</CardTitle>
                <CardDescription>Ortalama AI Güven</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage