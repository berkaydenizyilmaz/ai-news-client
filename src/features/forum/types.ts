// Forum Category Types
export interface ForumCategory {
  id: string
  name: string
  description?: string
  slug: string
  is_active: boolean
  topic_count: number
  post_count: number
  created_at: string
  updated_at: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  slug: string
}

// Forum Topic Types
export interface ForumTopic {
  id: string
  title: string
  slug: string
  content: string
  status: 'active' | 'locked' | 'deleted'
  is_pinned: boolean
  view_count: number
  reply_count: number
  like_count: number
  dislike_count: number
  last_reply_at?: string
  created_at: string
  updated_at: string
  category: {
    id: string
    name: string
    slug: string
  }
  user: {
    id: string
    username: string
    avatar_url?: string
    role: string
  }
}

export interface CreateTopicData {
  category_id: string
  title: string
  content: string
}

export interface UpdateTopicData {
  title?: string
  content?: string
  category_id?: string
}

// Forum Post Types
export interface ForumPost {
  id: string
  topic_id: string
  content: string
  is_deleted: boolean
  like_count: number
  dislike_count: number
  created_at: string
  updated_at: string
  user: {
    id: string
    username: string
    avatar_url?: string
    role: string
  }
  quotes?: any[]
}

export interface CreatePostData {
  topic_id: string
  content: string
}

export interface UpdatePostData {
  content: string
}

// Query Parameters
export interface TopicsQueryParams {
  category_id?: string
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'reply_count' | 'like_count' | 'last_reply_at'
  sort_order?: 'asc' | 'desc'
  search?: string
  status?: 'active' | 'locked' | 'deleted'
  is_pinned?: boolean
}

export interface PostsQueryParams {
  page?: number
  limit?: number
}

// Response Types
export interface TopicsResponse {
  topics: ForumTopic[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface PostsResponse {
  posts: ForumPost[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface TopicDetailResponse extends ForumTopic {
  posts: ForumPost[]
} 