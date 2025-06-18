import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Send, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useCreateComment, useUpdateComment } from '../hooks/use-comments'
import type { CommentWithUser } from '../types'

const commentSchema = z.object({
  content: z.string()
    .min(3, 'Yorum en az 3 karakter olmalıdır')
    .max(2000, 'Yorum en fazla 2000 karakter olabilir')
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  newsId: string
  parentComment?: CommentWithUser
  editingComment?: CommentWithUser
  onCancel?: () => void
  onSuccess?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function CommentForm({
  newsId,
  parentComment,
  editingComment,
  onCancel,
  onSuccess,
  placeholder = 'Yorumunuzu yazın...',
  autoFocus = false
}: CommentFormProps) {
  const { user } = useAuthStore()
  const [isExpanded, setIsExpanded] = useState(autoFocus || !!editingComment)
  
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: editingComment?.content || ''
    }
  })

  const isLoading = createCommentMutation.isPending || updateCommentMutation.isPending

  const onSubmit = async (data: CommentFormData) => {
    try {
      if (editingComment) {
        // Güncelleme
        await updateCommentMutation.mutateAsync({
          commentId: editingComment.id,
          data: { content: data.content }
        })
      } else {
        // Yeni yorum
        await createCommentMutation.mutateAsync({
          content: data.content,
          processed_news_id: newsId,
          parent_id: parentComment?.id
        })
      }
      
      form.reset()
      setIsExpanded(false)
      onSuccess?.()
    } catch (error) {
      // Error handling is done by the hooks
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsExpanded(false)
    onCancel?.()
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-4">
            Yorum yapmak için giriş yapmanız gerekiyor
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
            Giriş Yap
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all duration-200 ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        {/* Ana yorum için kullanıcı bilgisi */}
        {!parentComment && !editingComment && (
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user.username}</p>
              <p className="text-xs text-muted-foreground">
                {editingComment ? 'Yorumu düzenle' : parentComment ? 'Yanıtla' : 'Yorum yap'}
              </p>
            </div>
          </div>
        )}

        {/* Yanıtlanan yorum göstergesi */}
        {parentComment && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={parentComment.user?.avatar_url} alt={parentComment.user?.username} />
                <AvatarFallback>{parentComment.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{parentComment.user?.username}</span>
              <span className="text-xs text-muted-foreground">yanıtlıyorsun</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {parentComment.content}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={placeholder}
                      className={`min-h-[80px] resize-none transition-all duration-200 ${
                        isExpanded ? 'min-h-[120px]' : 'min-h-[80px]'
                      }`}
                      autoFocus={autoFocus}
                      onFocus={() => setIsExpanded(true)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Karakter sayacı */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {form.watch('content')?.length || 0}/2000 karakter
              </span>
              {isExpanded && (
                <span className="text-primary">
                  {editingComment ? 'Değişiklikleri kaydet' : parentComment ? 'Yanıtı gönder' : 'Yorumu gönder'}
                </span>
              )}
            </div>

            {/* Butonlar */}
            {isExpanded && (
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  İptal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !form.watch('content')?.trim()}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {editingComment ? 'Güncelle' : 'Gönder'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 