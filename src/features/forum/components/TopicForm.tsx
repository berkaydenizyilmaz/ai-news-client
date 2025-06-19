import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForumCategories, useCreateForumTopic, useUpdateForumTopic } from '../hooks/use-forum'
import type { ForumTopic } from '../types'

const topicSchema = z.object({
  category_id: z.string().min(1, 'Kategori seçimi zorunludur'),
  title: z.string()
    .min(5, 'Başlık en az 5 karakter olmalıdır')
    .max(500, 'Başlık en fazla 500 karakter olabilir'),
  content: z.string()
    .min(10, 'İçerik en az 10 karakter olmalıdır')
    .max(10000, 'İçerik en fazla 10000 karakter olabilir')
})

type TopicFormData = z.infer<typeof topicSchema>

interface TopicFormProps {
  editingTopic?: ForumTopic
  onSuccess?: (topicId: string) => void
  onCancel?: () => void
}

export function TopicForm({ editingTopic, onSuccess, onCancel }: TopicFormProps) {
  const [titleCount, setTitleCount] = useState(editingTopic?.title?.length || 0)
  const [contentCount, setContentCount] = useState(editingTopic?.content?.length || 0)
  
  const { data: categories, isLoading: categoriesLoading } = useForumCategories()
  const createTopicMutation = useCreateForumTopic()
  const updateTopicMutation = useUpdateForumTopic()
  
  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      category_id: editingTopic?.category.id || '',
      title: editingTopic?.title || '',
      content: editingTopic?.content || ''
    }
  })

  const isEditing = !!editingTopic
  const isSubmitting = createTopicMutation.isPending || updateTopicMutation.isPending

  const onSubmit = async (data: TopicFormData) => {
    try {
      if (isEditing) {
        await updateTopicMutation.mutateAsync({
          id: editingTopic.id,
          data: {
            title: data.title,
            content: data.content,
            category_id: data.category_id
          }
        })
        onSuccess?.(editingTopic.id)
      } else {
        const newTopic = await createTopicMutation.mutateAsync({
          category_id: data.category_id,
          title: data.title,
          content: data.content
        })
        form.reset()
        onSuccess?.(newTopic.id)
      }
    } catch (error) {
      console.error('Topic submission failed:', error)
    }
  }

  const handleTitleChange = (value: string) => {
    setTitleCount(value.length)
    return value
  }

  const handleContentChange = (value: string) => {
    setContentCount(value.length)
    return value
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
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

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input
                  placeholder="Konu başlığını yazın..."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleTitleChange(e.target.value)
                  }}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <div className="text-xs text-muted-foreground">
                  {titleCount}/500 karakter
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İçerik</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Konu içeriğini yazın..."
                  className="min-h-[200px] resize-none"
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
                  {contentCount}/10000 karakter
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting || categoriesLoading}
            className="min-w-[100px]"
          >
            {isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Konu Oluştur')}
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