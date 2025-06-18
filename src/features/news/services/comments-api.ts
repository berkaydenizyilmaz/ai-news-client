import { apiClient } from '@/lib/api-client'
import type { 
  CommentWithUser, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentModerationData,
  CommentStatistics,
  CommentsResponse,
  CommentQueryParams
} from '../types'

// Haber yorumlarını getir
export const getNewsComments = async (
  newsId: string, 
  params: CommentQueryParams = {}
): Promise<CommentsResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())
  if (params.sort_by) searchParams.append('sort_by', params.sort_by)
  if (params.sort_order) searchParams.append('sort_order', params.sort_order)
  if (params.include_deleted) searchParams.append('include_deleted', params.include_deleted.toString())

  const response = await apiClient.get(`/comments/news/${newsId}?${searchParams.toString()}`)
  return response.data.data
}

// Yorum detayını getir
export const getComment = async (commentId: string): Promise<CommentWithUser> => {
  const response = await apiClient.get(`/comments/${commentId}`)
  return response.data.data
}

// Yeni yorum oluştur
export const createComment = async (data: CreateCommentData): Promise<CommentWithUser> => {
  const response = await apiClient.post('/comments', data)
  return response.data.data
}

// Yorumu güncelle
export const updateComment = async (
  commentId: string, 
  data: UpdateCommentData
): Promise<CommentWithUser> => {
  const response = await apiClient.put(`/comments/${commentId}`, data)
  return response.data.data
}

// Yorumu sil
export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`)
}

// Toplu moderasyon (admin/moderator)
export const moderateComments = async (data: CommentModerationData): Promise<{
  success_count: number
  failed_count: number
  total_count: number
  failed_items: Array<{ id: string; error: string }>
}> => {
  const response = await apiClient.post('/comments/moderate', data)
  return response.data.data
}

// Yorum istatistikleri (admin/moderator)
export const getCommentStatistics = async (): Promise<CommentStatistics> => {
  const response = await apiClient.get('/comments/statistics')
  return response.data.data
} 