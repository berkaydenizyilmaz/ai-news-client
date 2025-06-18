import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { ProcessedNews } from '../types'

interface NewsCardProps {
  news: ProcessedNews
  onClick?: () => void
  className?: string
}

export function NewsCard({ news, onClick, className }: NewsCardProps) {
  const publishedDate = news.published_at ? new Date(news.published_at) : new Date(news.created_at)
  const timeAgo = formatDistanceToNow(publishedDate, { 
    addSuffix: true, 
    locale: tr 
  })

  return (
    <article 
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      {/* Resim varsa göster */}
      {news.image_url ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={news.image_url} 
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Kategori badge resim üzerinde */}
          {news.category && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white"
            >
              {news.category.name}
            </Badge>
          )}
          
          {/* AI güven skoru */}
          {news.confidence_score && news.confidence_score > 0.7 && (
            <Badge 
              variant="default"
              className="absolute top-3 right-3 bg-green-600 hover:bg-green-700"
            >
              AI Onaylı
            </Badge>
          )}
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <p className="text-sm">Görsel Yok</p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Kategori ve meta bilgiler */}
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          {!news.image_url && news.category && (
            <>
              <Badge variant="outline" className="text-xs">
                {news.category.name}
              </Badge>
              <span>•</span>
            </>
          )}
          <time dateTime={publishedDate.toISOString()}>
            {timeAgo}
          </time>
          {news.view_count > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>👁</span>
                {news.view_count.toLocaleString('tr-TR')}
              </span>
            </>
          )}
        </div>
        
        {/* Başlık */}
        <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        
        {/* Özet */}
        {news.summary && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
            {news.summary.replace(/\n+/g, ' ').trim()}
          </p>
        )}
        
        {/* Alt bilgiler */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {news.confidence_score && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>🤖</span>
                <span>%{Math.round(news.confidence_score * 100)} güven</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
            Devamını oku →
          </div>
        </div>
      </div>
    </article>
  )
} 