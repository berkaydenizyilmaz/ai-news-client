import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, ArrowLeft, Share2, Calendar, Eye, ExternalLink, AlertTriangle } from 'lucide-react'
import { CommentsSection } from './CommentsSection'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useNewsDetail } from '../hooks/use-news'
import { formatTextToParagraphs } from '@/lib/utils'
import { ReportForm } from '@/features/reports'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'

interface NewsDetailProps {
  news: any
}

export function NewsDetail({ news }: NewsDetailProps) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const { data: newsData, isLoading, isError, error, refetch } = useNewsDetail(news.id)

  if (isLoading) {
    return <NewsDetailSkeleton />
  }

  if (isError || !newsData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Haber bulunamadı</h2>
        <p className="text-muted-foreground mb-6">
          {error?.message || 'Aradığınız haber bulunamadı veya bir hata oluştu.'}
        </p>
        <div className="space-x-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <Button onClick={() => refetch()}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <article className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between p-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div className="flex items-center gap-2">
            {user && (
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-orange-600 hover:text-orange-700">
                    <AlertTriangle className="h-4 w-4" />
                    Şikayet Et
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <ReportForm
                    reportedType="news"
                    reportedId={newsData?.id || ''}
                    onSuccess={() => setShowReportDialog(false)}
                    onCancel={() => setShowReportDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Paylaş
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Hero Image */}
          {newsData.image_url && (
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={newsData.image_url} 
                alt={newsData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating badges on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex gap-2">
                  {newsData.category && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                      {newsData.category.name}
                    </Badge>
                  )}
                  {newsData.confidence_score && newsData.confidence_score > 0.8 && (
                    <Badge className="bg-green-500/20 backdrop-blur-sm text-green-100 border-green-300/30">
                      ✨ AI Onaylı
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Article Header */}
          <header className="space-y-6">
            {/* Badges for non-image layout */}
            {!newsData.image_url && (
              <div className="flex flex-wrap gap-2">
                {newsData.category && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {newsData.category.name}
                  </Badge>
                )}
                {newsData.confidence_score && (
                  <Badge 
                    variant={newsData.confidence_score > 0.8 ? 'default' : 'outline'}
                    className="text-sm px-3 py-1"
                  >
                    🤖 AI Güven: %{Math.round(newsData.confidence_score * 100)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {newsData.status === 'published' ? '✅ Yayında' : '⏳ Beklemede'}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {newsData.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <time className="font-medium">
                  {format(new Date(newsData.published_at || newsData.created_at), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                </time>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span className="font-medium">{newsData.view_count.toLocaleString('tr-TR')} görüntülenme</span>
              </div>
            </div>
          </header>

          {/* Summary */}
          {newsData.summary && (
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">📋 Özet</h2>
              <div className="text-lg leading-relaxed space-y-4 text-muted-foreground">
                {formatTextToParagraphs(newsData.summary).map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph.split('\n').map((line, lineIndex, lines) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            {newsData.content.includes('<') ? (
              <div 
                className="leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: newsData.content }}
              />
            ) : (
              <div className="leading-relaxed space-y-6 text-lg">
                {formatTextToParagraphs(newsData.content).map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph.split('\n').map((line, lineIndex, lines) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Source Analysis */}
          {newsData.differences_analysis && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xl">🔍</span>
                </div>
                <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  Kaynak Analizi
                </h2>
              </div>
              <div className="text-orange-900 dark:text-orange-100 leading-relaxed space-y-4">
                {formatTextToParagraphs(newsData.differences_analysis).map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph.split('\n').map((line, lineIndex, lines) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Related News */}
          {newsData.related_news && newsData.related_news.length > 0 && (
            <div className="bg-muted/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>🔗</span>
                İlgili Haberler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsData.related_news.map((relatedNews) => (
                  <div 
                    key={relatedNews.id}
                    className="group p-4 bg-background rounded-xl border hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate(`/news/${relatedNews.slug}`)}
                  >
                    <h4 className="font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {relatedNews.title}
                    </h4>
                    {relatedNews.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedNews.summary.replace(/\n+/g, ' ').trim()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources - Moved to bottom and minimized */}
          {newsData.sources && newsData.sources.length > 0 && (
            <div className="border-t pt-8 mt-12">
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <span className="text-sm font-medium">📚 Kaynaklar ({newsData.sources.length})</span>
                  <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 space-y-2">
                  {newsData.sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{source.source_name}</span>
                        {source.is_primary && (
                          <Badge variant="outline" className="text-xs">
                            Ana Kaynak
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={source.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Aç
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection 
        newsId={newsData.id} 
        newsTitle={newsData.title}
        className="max-w-4xl mx-auto mt-12"
      />
    </div>
  )
}

function NewsDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="aspect-[21/9] rounded-2xl" />
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
} 