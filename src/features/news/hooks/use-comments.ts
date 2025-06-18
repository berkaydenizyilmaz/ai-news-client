import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useErrorHandler } from '@/hooks/use-error-handler'
import type { 
  CommentWithUser, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentModerationData,
  CommentStatistics,
  CommentsResponse,
  CommentQueryParams
} from '../types'
import * as commentsApi from '../services/comments-api'

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
export const useNewsComments = (
  newsId: string, 
  params: CommentQueryParams = {},
  enabled = true
) => {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: commentKeys.newsCommentsWithParams(newsId, params),
    queryFn: () => commentsApi.getNewsComments(newsId, params),
    enabled: enabled && !!newsId,
    staleTime: 30 * 1000, // 30 saniye
    onError: handleError,
  })
}

// Yorum detayı
export const useComment = (commentId: string, enabled = true) => {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: commentKeys.comment(commentId),
    queryFn: () => commentsApi.getComment(commentId),
    enabled: enabled && !!commentId,
    onError: handleError,
  })
}

// Yeni yorum oluştur
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  return useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: (newComment, variables) => {
      // İlgili haber yorumları cache'ini güncelle
      queryClient.invalidateQueries({
        queryKey: commentKeys.newsComments(variables.processed_news_id)
      })
      
      toast.success('Yorum başarıyla eklendi')
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
    onSuccess: (_, commentId) => {
      // Tüm yorum cache'lerini güncelle
      queryClient.invalidateQueries({
        queryKey: commentKeys.all
      })
      
      toast.success('Yorum başarıyla silindi')
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
export const useCommentStatistics = (enabled = true) => {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: commentKeys.statistics(),
    queryFn: commentsApi.getCommentStatistics,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 dakika
    onError: handleError,
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