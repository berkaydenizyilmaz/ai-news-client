import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Eye, Clock, TrendingUp } from 'lucide-react'
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

  const isPopular = news.view_count > 1000
  const isHighConfidence = news.confidence_score && news.confidence_score > 0.8

  return (
    <article 
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-card border hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${className}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {news.image_url ? (
          <>
            <img 
              src={news.image_url} 
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">📰</span>
              </div>
              <p className="text-sm font-medium">Görsel Yok</p>
            </div>
          </div>
        )}
        
        {/* Floating badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {news.category && (
              <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm border-0 shadow-sm">
                {news.category.name}
              </Badge>
            )}
            {isHighConfidence && (
              <Badge className="bg-green-500/90 text-white hover:bg-green-500 backdrop-blur-sm border-0 shadow-sm">
                ✨ AI Onaylı
              </Badge>
            )}
          </div>
          
          {isPopular && (
            <Badge className="bg-red-500/90 text-white hover:bg-red-500 backdrop-blur-sm border-0 shadow-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popüler
            </Badge>
          )}
        </div>

        {/* Bottom overlay content */}
        {news.image_url && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-lg leading-tight text-white line-clamp-2 group-hover:text-primary-foreground transition-colors">
              {news.title}
            </h3>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title for non-image cards */}
        {!news.image_url && (
          <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h3>
        )}
        
        {/* Summary */}
        {news.summary && (
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
            {news.summary.replace(/\n+/g, ' ').trim()}
          </p>
        )}
        
        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <time dateTime={publishedDate.toISOString()}>
                {timeAgo}
              </time>
            </div>
            
            {news.view_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{news.view_count.toLocaleString('tr-TR')}</span>
              </div>
            )}
          </div>
          
          {news.confidence_score && (
            <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full">
              <span>🤖</span>
              <span className="font-medium">%{Math.round(news.confidence_score * 100)}</span>
            </div>
          )}
        </div>
        
        {/* Read more indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-muted/50">
          <div className="text-xs text-muted-foreground">
            {news.status === 'published' ? '✅ Yayında' : '⏳ Beklemede'}
          </div>
          <div className="text-xs font-medium text-primary group-hover:text-primary/80 transition-colors flex items-center gap-1">
            Devamını oku
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl transition-all duration-500 pointer-events-none" />
    </article>
  )
} 