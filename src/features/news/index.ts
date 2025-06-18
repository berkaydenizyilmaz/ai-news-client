// News modülü ana export dosyası

// Components
export { NewsCard } from './components/NewsCard'
export { NewsList } from './components/NewsList'
export { NewsDetail } from './components/NewsDetail'
export { NewsSearch } from './components/NewsSearch'
export { CategoryFilter } from './components/CategoryFilter'
export { CommentForm } from './components/CommentForm'
export { Comment } from './components/Comment'
export { CommentsSection } from './components/CommentsSection'

// Hooks
export { useNews, useNewsDetail, useCategories, useHomePageNews, useNewsFilters } from './hooks/use-news'
export { 
  useNewsComments, 
  useComment, 
  useCreateComment, 
  useUpdateComment, 
  useDeleteComment, 
  useModerationComments, 
  useCommentStatistics,
  useOptimisticComments,
  commentKeys
} from './hooks/use-comments'

// Services
export * from './services/news-api'

// Types
export type { 
  ProcessedNews, 
  NewsCategory, 
  NewsSource, 
  NewsFilters, 
  NewsResponse,
  Comment,
  CommentUser,
  CommentWithUser,
  CommentTreeNode,
  CreateCommentData,
  UpdateCommentData,
  CommentModerationData,
  CommentStatistics,
  CommentsResponse,
  CommentQueryParams,
  CommentStatus,
  CommentModerationAction
} from './types' 