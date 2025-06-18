import { useParams } from 'react-router-dom'
import { NewsDetail } from '@/features/news'

// Haber detay sayfası
// URL'den gelen slug parametresi ile haber detayını gösterir
function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Haber bulunamadı</h2>
        <p className="text-muted-foreground">
          Geçersiz haber adresi
        </p>
      </div>
    )
  }

  return <NewsDetail newsId={slug} />
}

export default NewsDetailPage 