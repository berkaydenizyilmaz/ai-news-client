import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Trash2, Eye, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useDeleteNewsMutation, useUpdateNewsMutation } from '@/features/news'
import type { NewsListResponse, NewsStatus } from '@/features/news'

interface NewsTableProps {
  data?: NewsListResponse
  isLoading: boolean
  onEdit: (newsId: string) => void
  onPageChange: (page: number) => void
  currentPage: number
}

export function NewsTable({ data, isLoading, onEdit, onPageChange, currentPage }: NewsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null)
  
  const deleteNewsMutation = useDeleteNewsMutation()
  const updateNewsMutation = useUpdateNewsMutation()

  const handleDelete = (newsId: string) => {
    setDeletingNewsId(newsId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingNewsId) return
    
    try {
      await deleteNewsMutation.mutateAsync(deletingNewsId)
      setDeleteDialogOpen(false)
      setDeletingNewsId(null)
    } catch (error) {
      console.error('Haber silme hatası:', error)
    }
  }

  const handleStatusChange = async (newsId: string, status: NewsStatus) => {
    try {
      await updateNewsMutation.mutateAsync({
        id: newsId,
        data: { status }
      })
    } catch (error) {
      console.error('Durum güncelleme hatası:', error)
    }
  }

  const getStatusBadge = (status: NewsStatus) => {
    const variants = {
      published: { variant: 'default' as const, label: 'Yayında', color: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
      processing: { variant: 'outline' as const, label: 'İşleniyor', color: 'bg-blue-100 text-blue-800' },
      rejected: { variant: 'destructive' as const, label: 'Reddedilen', color: 'bg-red-100 text-red-800' }
    }
    
    const config = variants[status]
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-24" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.news.length) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium mb-2">Haber bulunamadı</h3>
          <p className="text-muted-foreground">
            Henüz haber bulunmuyor veya filtrelere uygun haber yok.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Haber</th>
                  <th className="text-left p-4 font-medium">Kategori</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-left p-4 font-medium">Tarih</th>
                  <th className="text-left p-4 font-medium">Görüntülenme</th>
                  <th className="text-left p-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {data.news.map((news) => (
                  <tr key={news.id} className="border-b hover:bg-muted/25 transition-colors">
                    <td className="p-4">
                      <div className="flex items-start space-x-3">
                        {news.image_url ? (
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Görsel Yok</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-2 mb-1">
                            {news.title}
                          </h4>
                          {news.summary && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {news.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {news.category ? (
                        <Badge variant="outline">{news.category.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Kategori Yok</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(news.status)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(news.created_at), 'dd MMM yyyy', { locale: tr })}
                        </div>
                        <div className="text-muted-foreground">
                          {format(new Date(news.created_at), 'HH:mm')}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3 w-3" />
                        {news.view_count.toLocaleString('tr-TR')}
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(news.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {news.status !== 'published' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(news.id, 'published')}
                            >
                              Yayınla
                            </DropdownMenuItem>
                          )}
                          
                          {news.status !== 'pending' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(news.id, 'pending')}
                            >
                              Bekletme Al
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDelete(news.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const page = i + 1
              const isCurrentPage = page === currentPage
              
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              )
            })}
            
            {data.totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(data.totalPages)}
                >
                  {data.totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === data.totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}

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
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteNewsMutation.isPending}
            >
              {deleteNewsMutation.isPending ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 