import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCreateForumPost, useUpdateForumPost } from '../hooks/use-forum'
import type { ForumPost } from '../types'

const postSchema = z.object({
  content: z.string()
    .min(3, 'Gönderi içeriği en az 3 karakter olmalıdır')
    .max(5000, 'Gönderi içeriği en fazla 5000 karakter olabilir')
})

type PostFormData = z.infer<typeof postSchema>

interface PostFormProps {
  topicId: string
  editingPost?: ForumPost
  onSuccess?: () => void
  onCancel?: () => void
}

export function PostForm({ topicId, editingPost, onSuccess, onCancel }: PostFormProps) {
  const [charCount, setCharCount] = useState(editingPost?.content?.length || 0)
  
  const createPostMutation = useCreateForumPost()
  const updatePostMutation = useUpdateForumPost()
  
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: editingPost?.content || ''
    }
  })

  const isEditing = !!editingPost
  const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending

  const onSubmit = async (data: PostFormData) => {
    try {
      if (isEditing) {
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          data: { content: data.content }
        })
      } else {
        await createPostMutation.mutateAsync({
          topic_id: topicId,
          content: data.content
        })
      }
      
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Post submission failed:', error)
    }
  }

  const handleContentChange = (value: string) => {
    setCharCount(value.length)
    return value
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditing ? 'Gönderiyi Düzenle' : 'Yanıtınız'}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isEditing ? 'Gönderi içeriğini düzenleyin...' : 'Yanıtınızı yazın...'}
                  className="min-h-[120px] resize-none"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleContentChange(e.target.value)
                  }}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <div className="text-xs text-muted-foreground">
                  {charCount}/5000 karakter
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? 'Gönderiliyor...' : (isEditing ? 'Güncelle' : 'Gönder')}
          </Button>
          
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              İptal
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
} 