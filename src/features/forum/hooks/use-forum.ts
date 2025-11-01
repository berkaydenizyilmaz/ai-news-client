import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import {
  getForumCategories,
  getForumCategory,
  createForumCategory,
  getForumTopics,
  getForumTopic,
  createForumTopic,
  updateForumTopic,
  deleteForumTopic,
  getTopicPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost
} from '../services/forum-api'

// Category Hooks
export const useForumCategories = () => {
  return useQuery<ForumCategory[]>({
    queryKey: ['forum-categories'],
    queryFn: getForumCategories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data || [],
    onError: (error) => {
      console.warn('Forum kategorileri yüklenemedi:', error);
    }
  })
}

export const useForumCategory = (id: string) => {
  return useQuery<ForumCategory>({
    queryKey: ['forum-category', id],
    queryFn: () => getForumCategory(id),
    enabled: !!id
  })
}

export const useCreateForumCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<ForumCategory, Error, CreateCategoryData>({
    mutationFn: createForumCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] })
    }
  })
}

// Topic Hooks
export const useForumTopics = (params?: TopicsQueryParams) => {
  return useQuery<TopicsResponse>({
    queryKey: ['forum-topics', params],
    queryFn: () => getForumTopics(params)
  })
}

export const useForumTopic = (id: string) => {
  return useQuery<TopicDetailResponse>({
    queryKey: ['forum-topic', id],
    queryFn: () => getForumTopic(id),
    enabled: !!id
  })
}

export const useCreateForumTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ForumTopic, Error, CreateTopicData>({
    mutationFn: createForumTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] })
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] })
    }
  })
}

export const useUpdateForumTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ForumTopic, Error, { id: string; data: UpdateTopicData }>({
    mutationFn: ({ id, data }) => updateForumTopic(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['forum-topic', id] })
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] })
    }
  })
}

export const useDeleteForumTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteForumTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] })
      queryClient.invalidateQueries({ queryKey: ['forum-categories'] })
    }
  })
}

// Post Hooks
export const useTopicPosts = (topicId: string, params?: PostsQueryParams) => {
  return useQuery<PostsResponse>({
    queryKey: ['topic-posts', topicId, params],
    queryFn: () => getTopicPosts(topicId, params),
    enabled: !!topicId
  })
}

export const useCreateForumPost = () => {
  const queryClient = useQueryClient()

  return useMutation<ForumPost, Error, CreatePostData>({
    mutationFn: createForumPost,
    onSuccess: (_, { topic_id }) => {
      queryClient.invalidateQueries({ queryKey: ['topic-posts', topic_id] })
      queryClient.invalidateQueries({ queryKey: ['forum-topic', topic_id] })
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] })
    }
  })
}

export const useUpdateForumPost = () => {
  const queryClient = useQueryClient()

  return useMutation<ForumPost, Error, { id: string; data: UpdatePostData }>({
    mutationFn: ({ id, data }) => updateForumPost(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['topic-posts', data.topic_id] })
      queryClient.invalidateQueries({ queryKey: ['forum-topic', data.topic_id] })
    }
  })
}

export const useDeleteForumPost = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; topicId: string }>({
    mutationFn: ({ id }) => deleteForumPost(id),
    onSuccess: (_, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: ['topic-posts', topicId] })
      queryClient.invalidateQueries({ queryKey: ['forum-topic', topicId] })
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] })
    }
  })
} 