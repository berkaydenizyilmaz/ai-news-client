import { useParams, useNavigate } from 'react-router-dom'
import { NewsDetail, useNewsDetail } from '@/features/news'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

// Haber detay sayfası
// URL'den gelen slug parametresi ile haber detayını gösterir
function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: news, isLoading, isError } = useNewsDetail(slug)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !news) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Haber bulunamadı</h2>
        <p className="text-muted-foreground mb-6">
          Aradığınız haber mevcut değil veya kaldırılmış olabilir.
        </p>
        <Button onClick={() => navigate('/news')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Haberlere Dön
        </Button>
      </div>
    )
  }

  return <NewsDetail news={news} />
}

export default NewsDetailPage 