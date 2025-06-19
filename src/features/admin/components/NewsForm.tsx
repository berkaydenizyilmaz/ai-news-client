import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { X, Save } from 'lucide-react'
import { useNewsDetail, useCreateNews, useUpdateNews } from '@/features/news'
import type { NewsCategory } from '@/features/news'

const newsFormSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(255, 'Başlık çok uzun'),
  summary: z.string().optional(),
  content: z.string().min(1, 'İçerik gereklidir'),
  image_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  category_id: z.string().min(1, 'Kategori seçiniz'),
  status: z.enum(['published', 'pending', 'processing', 'rejected'] as const),
  tags: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

type NewsFormData = z.infer<typeof newsFormSchema>

interface NewsFormProps {
  newsId?: string | null
  onClose: () => void
  categories: NewsCategory[]
}

export function NewsForm({ newsId, onClose, categories }: NewsFormProps) {
  const isEditing = Boolean(newsId)
  
  const { data: newsDetail } = useNewsDetail(isEditing ? newsId! : undefined)
  
  const createNewsMutation = useCreateNews()
  const updateNewsMutation = useUpdateNews()

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      image_url: '',
      category_id: '',
      status: 'pending',
      tags: '',
      meta_title: '',
      meta_description: '',
    }
  })

  // Form verilerini doldur (düzenleme modunda)
  useEffect(() => {
    if (newsDetail) {
      form.reset({
        title: newsDetail.title,
        summary: newsDetail.summary || '',
        content: newsDetail.content,
        image_url: newsDetail.image_url || '',
        category_id: newsDetail.category?.id || '',
        status: newsDetail.status,
        tags: newsDetail.tags?.join(', ') || '',
        meta_title: newsDetail.meta_title || '',
        meta_description: newsDetail.meta_description || '',
      })
    }
  }, [newsDetail, form])

  const onSubmit = async (data: NewsFormData) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        image_url: data.image_url || undefined,
        summary: data.summary || undefined,
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
      }

      if (isEditing && newsId) {
        await updateNewsMutation.mutateAsync({
          id: newsId,
          data: formattedData
        })
      } else {
        await createNewsMutation.mutateAsync(formattedData)
      }

      onClose()
    } catch (error) {
      console.error('Form gönderim hatası:', error)
    }
  }

  const isLoading = createNewsMutation.isPending || updateNewsMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">
            {isEditing ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Kolon - Ana İçerik */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Başlık */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Haber başlığını giriniz" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Özet */}
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Özet</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Haber özeti (isteğe bağlı)"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* İçerik */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İçerik *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Haber içeriğini giriniz"
                            rows={12}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sağ Kolon - Meta Bilgiler */}
                <div className="space-y-6">
                  {/* Durum */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Beklemede</SelectItem>
                            <SelectItem value="published">Yayında</SelectItem>
                            <SelectItem value="processing">İşleniyor</SelectItem>
                            <SelectItem value="rejected">Reddedilen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Kategori */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Görsel URL */}
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Görsel URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Görsel Önizleme */}
                  {form.watch('image_url') && (
                    <div className="space-y-2">
                      <FormLabel>Görsel Önizleme</FormLabel>
                      <img
                        src={form.watch('image_url')}
                        alt="Önizleme"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Etiketler */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiketler</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="etiket1, etiket2, etiket3"
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground">
                          Etiketleri virgülle ayırınız
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SEO Bölümü */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">SEO Ayarları</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Başlık</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SEO başlığı" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="SEO açıklaması"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Butonları */}
              <div className="flex items-center justify-end space-x-2 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  İptal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading 
                    ? (isEditing ? 'Güncelleniyor...' : 'Kaydediliyor...') 
                    : (isEditing ? 'Güncelle' : 'Kaydet')
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 