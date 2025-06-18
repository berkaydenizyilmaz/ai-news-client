import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ArrowLeft, Calendar, Eye, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useNewsDetail } from '../hooks/use-news'
import { formatTextToParagraphs } from '@/lib/utils'
import type { ProcessedNews } from '../types'

interface NewsDetailProps {
  newsId: string
}

export function NewsDetail({ newsId }: NewsDetailProps) {
  const navigate = useNavigate()
  const { data: news, isLoading, isError, refetch } = useNewsDetail(newsId)

  if (isLoading) {
    return <NewsDetailSkeleton />
  }

  if (isError || !news) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Haber yüklenemedi</h3>
        <p className="text-muted-foreground mb-4">
          Haber bulunamadı veya bir hata oluştu.
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
    <article className="max-w-4xl mx-auto space-y-6">
      {/* Geri dön butonu */}
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri Dön
      </Button>

      {/* Ana görsel */}
      {news.image_url && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <img 
            src={news.image_url} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Başlık ve meta bilgiler */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {news.category && (
            <Badge variant="secondary">
              {news.category.name}
            </Badge>
          )}
          
          {news.confidence_score && (
            <Badge 
              variant={news.confidence_score > 0.8 ? 'default' : 'outline'}
            >
              AI Güven: %{Math.round(news.confidence_score * 100)}
            </Badge>
          )}
          
          <Badge variant="outline">
            {news.status === 'published' ? 'Yayında' : 'Beklemede'}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(news.published_at || news.created_at), 'dd MMMM yyyy, HH:mm', { locale: tr })}
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {news.view_count} görüntülenme
          </div>
        </div>
      </header>

      {/* Özet */}
      {news.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              {formatTextToParagraphs(news.summary).map((paragraph, index) => (
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
          </CardContent>
        </Card>
      )}

      {/* Ana içerik */}
      <div className="prose prose-lg max-w-none">
        {news.content.includes('<') ? (
          // HTML içerik varsa dangerouslySetInnerHTML kullan
          <div 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        ) : (
          // Plain text ise formatla
          <div className="leading-relaxed space-y-4">
            {formatTextToParagraphs(news.content).map((paragraph, index) => (
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

      {/* Kaynaklar */}
      {news.sources && news.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kaynaklar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {news.sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{source.source_name}</p>
                    {source.is_primary && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Ana Kaynak
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={source.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Farklılıklar analizi */}
      {news.differences_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-orange-500">🔍</span>
              Kaynak Analizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="text-orange-900 dark:text-orange-100 leading-relaxed space-y-4">
                {formatTextToParagraphs(news.differences_analysis).map((paragraph, index) => (
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
          </CardContent>
        </Card>
      )}

      {/* İlgili haberler */}
      {news.related_news && news.related_news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">İlgili Haberler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.related_news.map((relatedNews) => (
                <div 
                  key={relatedNews.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/news/${relatedNews.slug}`)}
                >
                  <h4 className="font-medium line-clamp-2 mb-2">
                    {relatedNews.title}
                  </h4>
                  {relatedNews.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedNews.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  )
}

function NewsDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="aspect-video rounded-lg" />
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
} 