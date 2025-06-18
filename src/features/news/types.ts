// News modülü için TypeScript tip tanımları
// API dokümantasyonuna uygun şekilde hazırlanmıştır

export type NewsStatus = 'pending' | 'processing' | 'published' | 'rejected'

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewsSource {
  id: string
  processed_news_id: string
  source_name: string
  source_url: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface ProcessedNews {
  id: string
  original_news_id?: string
  title: string
  slug: string
  content: string
  summary?: string
  image_url?: string
  category_id?: string
  status: NewsStatus
  confidence_score?: number
  differences_analysis?: string
  view_count: number
  published_at?: string
  created_at: string
  updated_at: string
  tags?: string[]
  meta_title?: string
  meta_description?: string
  // İlişkili veriler
  category?: NewsCategory
  sources?: NewsSource[]
  related_news?: ProcessedNews[]
}

// API Response tipleri
export interface NewsListResponse {
  news: ProcessedNews[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface NewsStatistics {
  total_news: number
  published_news: number
  pending_news: number
  processing_news: number
  rejected_news: number
  categories_count: number
  avg_confidence_score: number
  total_sources: number
  processing_time_avg: number
}

// Query parametreleri
export interface NewsQueryParams {
  page?: number
  limit?: number
  search?: string
  category_id?: string
  status?: NewsStatus
  sort_by?: 'created_at' | 'updated_at' | 'published_at' | 'view_count'
  sort_order?: 'asc' | 'desc'
  date_from?: string
  date_to?: string
}

export interface CategoryQueryParams {
  page?: number
  limit?: number
  search?: string
  is_active?: boolean
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
} 