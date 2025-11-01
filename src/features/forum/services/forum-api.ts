import { apiClient } from '@/lib/api-client'
import type {
  ForumCategory,
  CreateCategoryData,
  ForumTopic,
  CreateTopicData,
  UpdateTopicData,
  ForumPost,
  CreatePostData,
  UpdatePostData,
  TopicsQueryParams,
  PostsQueryParams,
  TopicsResponse,
  PostsResponse,
  TopicDetailResponse
} from '../types'

// Category API Functions
export const getForumCategories = async (): Promise<ForumCategory[]> => {
  console.log('🔍 Forum kategorileri API çağrısı yapılıyor...')
  const response = await apiClient.get('/forum/categories')
  console.log('📊 Forum kategorileri response:', response)
  console.log('📋 Forum kategorileri data:', response.data)
  return response.data.data
}

export const getForumCategory = async (id: string): Promise<ForumCategory> => {
  const response = await apiClient.get(`/forum/categories/${id}`)
  return response.data.data
}

export const createForumCategory = async (data: CreateCategoryData): Promise<ForumCategory> => {
  const response = await apiClient.post('/forum/categories', data)
  return response.data.data
}

// Topic API Functions
export const getForumTopics = async (params?: TopicsQueryParams): Promise<TopicsResponse> => {
  const response = await apiClient.get('/forum/topics', { params })
  return response.data.data
}

export const getForumTopic = async (id: string): Promise<TopicDetailResponse> => {
  const response = await apiClient.get(`/forum/topics/${id}`)
  return response.data.data
}

export const createForumTopic = async (data: CreateTopicData): Promise<ForumTopic> => {
  const response = await apiClient.post('/forum/topics', data)
  return response.data.data
}

export const updateForumTopic = async (id: string, data: UpdateTopicData): Promise<ForumTopic> => {
  const response = await apiClient.put(`/forum/topics/${id}`, data)
  return response.data.data
}

export const deleteForumTopic = async (id: string): Promise<void> => {
  await apiClient.delete(`/forum/topics/${id}`)
}

// Post API Functions
export const getTopicPosts = async (topicId: string, params?: PostsQueryParams): Promise<PostsResponse> => {
  const response = await apiClient.get(`/forum/topics/${topicId}/posts`, { params })
  return response.data.data
}

export const createForumPost = async (data: CreatePostData): Promise<ForumPost> => {
  const response = await apiClient.post('/forum/posts', data)
  return response.data.data
}

export const updateForumPost = async (id: string, data: UpdatePostData): Promise<ForumPost> => {
  const response = await apiClient.put(`/forum/posts/${id}`, data)
  return response.data.data
}

export const deleteForumPost = async (id: string): Promise<void> => {
  await apiClient.delete(`/forum/posts/${id}`)
} 