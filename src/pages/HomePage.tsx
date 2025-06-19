import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, Clock, Eye, Zap, Star, Globe, BarChart3 } from 'lucide-react'
import { useHomePageNews, NewsCard, type ProcessedNews } from '@/features/news'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

// Kategori ikonları ve renkleri
const getCategoryStyle = (categoryName: string) => {
  const styles: Record<string, { icon: string; color: string; bg: string }> = {
    'teknoloji': { icon: '💻', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    'spor': { icon: '⚽', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
    'siyaset': { icon: '🏛️', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    'ekonomi': { icon: '💰', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
    'sağlık': { icon: '🏥', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
    'eğitim': { icon: '📚', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    'kültür': { icon: '🎭', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/20' },
    'sanat': { icon: '🎨', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/20' },
    'müzik': { icon: '🎵', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/20' },
    'sinema': { icon: '🎬', color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
    'bilim': { icon: '🔬', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    'çevre': { icon: '🌍', color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-950/20' },
    'otomobil': { icon: '🚗', color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-950/20' },
    'gündem': { icon: '📰', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-950/20' },
    'dünya': { icon: '🌎', color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  }
  
  const normalizedName = categoryName.toLowerCase().trim()
  return styles[normalizedName] || { icon: '📋', color: 'text-muted-foreground', bg: 'bg-muted/20' }
}

function HomePage() {
  const navigate = useNavigate()
  const { latestNews, categories, isLoading, isError, refetch } = useHomePageNews()

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/news?category=${categoryId}`)
  }

  const handleViewAllNews = () => {
    navigate('/news')
  }

  // Featured news (first 3)
  const featuredNews = latestNews.slice(0, 3)
  // Recent news (remaining)
  const recentNews = latestNews.slice(3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-2">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center">
              {/* Breaking News Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                CANLI HABERLER
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
                AI NEWS
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                Yapay zeka destekli haber platformu. Güvenilir kaynaklardan derlenen, 
                objektif analiz edilen ve gerçek zamanlı güncellenen haberler.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={handleViewAllNews}>
                  <Zap className="mr-2 h-6 w-6" />
                  Haberleri Keşfet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black mb-4 flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  Öne Çıkan Haberler
                </h2>
                <p className="text-lg text-muted-foreground">En önemli ve güncel gelişmeler</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main featured news */}
              <div className="lg:col-span-2">
                {featuredNews[0] && (
                  <div 
                    className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                    onClick={() => navigate(`/news/${featuredNews[0].slug}`)}
                  >
                    <div className="aspect-[16/10] relative">
                      {featuredNews[0].image_url ? (
                        <>
                          <img 
                            src={featuredNews[0].image_url} 
                            alt={featuredNews[0].title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-6xl">📰</span>
                        </div>
                      )}
                      
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-2 mb-4">
                          {featuredNews[0].category && (
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                              {featuredNews[0].category.name}
                            </Badge>
                          )}
                          <Badge className="bg-yellow-500/20 backdrop-blur-sm text-yellow-100 border-yellow-300/30">
                            <Star className="w-3 h-3 mr-1" />
                            Öne Çıkan
                          </Badge>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 line-clamp-2">
                          {featuredNews[0].title}
                        </h3>
                        {featuredNews[0].summary && (
                          <p className="text-white/80 line-clamp-2 mb-4">
                            {featuredNews[0].summary.replace(/\n+/g, ' ').trim()}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(new Date(featuredNews[0].published_at || featuredNews[0].created_at), { addSuffix: true, locale: tr })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {featuredNews[0].view_count.toLocaleString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/*
              {/* Side featured news */}
              <div className="space-y-6">
                {featuredNews.slice(1, 3).map((news: ProcessedNews) => (
                  <div 
                    key={news.id}
                    className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate(`/news/${news.slug}`)}
                  >
                    <div className="aspect-[16/9] relative">
                      {news.image_url ? (
                        <>
                          <img 
                            src={news.image_url} 
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <span className="text-3xl">📰</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-primary-foreground transition-colors">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(news.published_at || news.created_at), { addSuffix: true, locale: tr })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              Haber Kategorileri
            </h2>
            <p className="text-lg text-muted-foreground">İlgilendiğiniz konulara göre haberleri keşfedin</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.map((category: { id: string; name: string }) => {
                const style = getCategoryStyle(category.name)
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`group p-6 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${style.bg}`}
                  >
                    <div className="text-center">
                      <div className={`w-14 h-14 mx-auto mb-3 rounded-full bg-white dark:bg-gray-800 shadow-md group-hover:shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <span className="text-3xl">
                          {style.icon}
                        </span>
                      </div>
                      <h3 className={`font-bold text-sm group-hover:scale-105 transition-transform ${style.color}`}>
                        {category.name}
                      </h3>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : null}
        </section>

        {/* Recent News */}
        {recentNews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black mb-4 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  Son Haberler
                </h2>
                <p className="text-lg text-muted-foreground">En güncel gelişmeler ve haberler</p>
              </div>
              <Button variant="ghost" onClick={handleViewAllNews} className="hidden md:flex gap-2 text-lg">
                Tümünü Gör
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[16/9] rounded-2xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16 bg-muted/30 rounded-3xl">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-2">Haberler yüklenemedi</h3>
                <p className="text-muted-foreground mb-6">Bir hata oluştu, lütfen tekrar deneyin</p>
                <Button onClick={refetch} variant="outline" size="lg">
                  Tekrar Dene
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentNews.map((news: ProcessedNews) => (
                    <NewsCard
                      key={news.id}
                      news={news}
                      onClick={() => navigate(`/news/${news.slug}`)}
                    />
                  ))}
                </div>
                
                {/* Mobile "Tümünü Gör" butonu */}
                <div className="text-center mt-12 md:hidden">
                  <Button onClick={handleViewAllNews} size="lg" className="gap-2">
                    Tüm Haberleri Gör
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Newsletter/CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Haberleri Kaçırmayın!</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            En güncel haberler ve gelişmeler için hemen keşfetmeye başlayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleViewAllNews} className="gap-2">
              <Zap className="h-5 w-5" />
              Haberleri Keşfet
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/news?sort=view_count')} className="gap-2">
              <TrendingUp className="h-5 w-5" />
              Popüler Haberler
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage 