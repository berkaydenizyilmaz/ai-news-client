import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useErrorHandler } from '@/hooks/use-error-handler'
import * as commentsApi from '../services/comments-api'
import type { 
  CommentWithUser,
  CommentQueryParams,
  CommentsResponse,
  UpdateCommentData
} from '../types'

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  newsComments: (newsId: string) => [...commentKeys.all, 'news', newsId] as const,
  newsCommentsWithParams: (newsId: string, params: CommentQueryParams) => 
    [...commentKeys.newsComments(newsId), params] as const,
  comment: (id: string) => [...commentKeys.all, 'detail', id] as const,
  statistics: () => [...commentKeys.all, 'statistics'] as const,
}

// Haber yorumlarını getir
export const useNewsComments = (newsId: string, params: CommentQueryParams = {}) => {
  return useQuery({
    queryKey: commentKeys.newsCommentsWithParams(newsId, params),
    queryFn: () => commentsApi.getNewsComments(newsId, params),
    enabled: !!newsId,
    staleTime: 2 * 60 * 1000, // 2 dakika
  })
}

// Yorum detayı
export const useComment = (commentId: string | undefined) => {
  return useQuery({
    queryKey: commentKeys.comment(commentId || ''),
    queryFn: () => commentsApi.getComment(commentId!),
    enabled: !!commentId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Yeni yorum oluştur
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()
  
  return useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: (_, variables) => {
      // İlgili haber yorumlarını yenile
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.newsComments(variables.processed_news_id) 
      })
      // Genel istatistikleri yenile
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.statistics() 
      })
    },
    onError: handleError,
  })
}

// Yorumu güncelle
export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentData }) =>
      commentsApi.updateComment(commentId, data),
    onSuccess: (updatedComment) => {
      // Yorum detayı cache'ini güncelle
      queryClient.setQueryData(
        commentKeys.comment(updatedComment.id),
        updatedComment
      )
      
      // İlgili haber yorumları cache'ini güncelle
      queryClient.invalidateQueries({
        queryKey: commentKeys.newsComments(updatedComment.processed_news_id)
      })
      
      toast.success('Yorum başarıyla güncellendi')
    },
    onError: handleError,
  })
}

// Yorumu sil
export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()
  
  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      // Tüm yorum sorgularını yenile
      queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
    onError: handleError,
  })
}

// Toplu moderasyon
export const useModerationComments = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  return useMutation({
    mutationFn: commentsApi.moderateComments,
    onSuccess: (result) => {
      // Tüm yorum cache'lerini güncelle
      queryClient.invalidateQueries({
        queryKey: commentKeys.all
      })
      
      toast.success(
        `Moderasyon tamamlandı: ${result.success_count} başarılı, ${result.failed_count} başarısız`
      )
    },
    onError: handleError,
  })
}

// Yorum istatistikleri
export const useCommentStatistics = () => {
  return useQuery({
    queryKey: commentKeys.statistics(),
    queryFn: () => commentsApi.getCommentStatistics(),
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Optimistic update için yardımcı hook
export const useOptimisticComments = (newsId: string) => {
  const queryClient = useQueryClient()

  const addOptimisticComment = (newComment: Partial<CommentWithUser>) => {
    queryClient.setQueryData(
      commentKeys.newsComments(newsId),
      (old: CommentsResponse | undefined) => {
        if (!old) return old
        
        const optimisticComment: CommentWithUser = {
          id: `temp-${Date.now()}`,
          processed_news_id: newsId,
          user_id: '',
          content: newComment.content || '',
          is_deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          can_edit: true,
          can_delete: true,
          replies: [],
          reply_count: 0,
          ...newComment,
        }

        return {
          ...old,
          comments: [optimisticComment, ...old.comments],
          total: old.total + 1,
        }
      }
    )
  }

  const removeOptimisticComment = (commentId: string) => {
    queryClient.setQueryData(
      commentKeys.newsComments(newsId),
      (old: CommentsResponse | undefined) => {
        if (!old) return old
        
        return {
          ...old,
          comments: old.comments.filter(comment => comment.id !== commentId),
          total: Math.max(0, old.total - 1),
        }
      }
    )
  }

  return { addOptimisticComment, removeOptimisticComment }
} 