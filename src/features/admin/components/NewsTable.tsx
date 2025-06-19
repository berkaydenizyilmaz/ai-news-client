import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Eye, Calendar, BarChart3 } from 'lucide-react'
import { useDeleteNews } from '@/features/news'
import type { NewsListResponse, ProcessedNews } from '@/features/news'

interface NewsTableProps {
  data: NewsListResponse | undefined
  isLoading: boolean
  onEdit: (newsId: string) => void
  onPageChange: (page: number) => void
  currentPage: number
}

export function NewsTable({ data, isLoading, onEdit, onPageChange, currentPage }: NewsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null)
  
  const deleteNewsMutation = useDeleteNews()

  const handleDeleteClick = (newsId: string) => {
    setDeletingNewsId(newsId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingNewsId) {
      try {
        await deleteNewsMutation.mutateAsync(deletingNewsId)
        setDeleteDialogOpen(false)
        setDeletingNewsId(null)
      } catch (error) {
        console.error('Haber silinirken hata:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Haberler Yükleniyor...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.news || data.news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Haber Bulunamadı</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Henüz yayınlanmış haber bulunmuyor.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yayınlanan Haberler ({data.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Başlık</TableHead>
                  <TableHead className="w-[20%]">Kategori</TableHead>
                  <TableHead className="w-[15%]">Görüntülenme</TableHead>
                  <TableHead className="w-[15%]">Yayın Tarihi</TableHead>
                  <TableHead className="w-[10%] text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.news.map((news: ProcessedNews) => (
                  <TableRow key={news.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <h4 className="font-medium leading-tight">
                          {truncateText(news.title, 80)}
                        </h4>
                        {news.summary && (
                          <p className="text-sm text-muted-foreground">
                            {truncateText(news.summary, 120)}
                          </p>
                        )}
                        {news.tags && news.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {news.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {news.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{news.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {news.category ? (
                        <Badge variant="secondary">
                          {news.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{news.view_count.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {news.published_at 
                            ? formatDate(news.published_at)
                            : formatDate(news.created_at)
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(news.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(news.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Sayfa {data.page} / {data.totalPages} - Toplam {data.total} haber
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Önceki
                </Button>
                <span className="text-sm px-2">
                  {currentPage} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= data.totalPages}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Haberi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 