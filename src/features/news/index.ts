// News modülü ana export dosyası

// Components
export { NewsCard } from './components/NewsCard'
export { NewsList } from './components/NewsList'
export { NewsDetail } from './components/NewsDetail'
export { CategoryFilter } from './components/CategoryFilter'
export { NewsSearch } from './components/NewsSearch'
export { CommentsSection } from './components/CommentsSection'
export { CommentForm } from './components/CommentForm'
export { Comment as NewsComment } from './components/Comment'

// Hooks
export { 
  useNews,
  useNewsDetail,
  useCategories,
  useCategoriesQuery,
  useNewsStatistics,
  useHomePageNews,
  useNewsFilters,
  useCreateNews,
  useUpdateNews,
  useDeleteNews
} from './hooks/use-news'

export {
  useNewsComments,
  useComment,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useCommentStatistics
} from './hooks/use-comments'

// Services
export * from './services/news-api'
export * from './services/comments-api'

// Types
export type {
  ProcessedNews,
  NewsListResponse,
  NewsQueryParams,
  CategoryQueryParams,
  NewsStatistics,
  NewsStatus,
  NewsCategory,
  CommentWithUser,
  CommentQueryParams,
  CommentStatistics,
  CommentsResponse
} from './types' 