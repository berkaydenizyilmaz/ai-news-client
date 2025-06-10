// RSS Feature Types
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RssSource {
  id: string;
  name: string;
  url: string;
  description?: string;
  category_id?: string;
  is_active: boolean;
  last_fetched_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: NewsCategory;
}

export interface CreateRssSourceRequest {
  name: string;
  url: string;
  description?: string;
  category_id?: string;
}

export interface UpdateRssSourceRequest {
  name?: string;
  url?: string;
  description?: string;
  category_id?: string;
  is_active?: boolean;
}

export interface RssFetchRequest {
  source_id?: string;
  max_items?: number;
  force_refresh?: boolean;
}

export interface RssFetchResult {
  total_sources_processed: number;
  total_news_fetched: number;
  new_news_count: number;
  duplicate_news_count: number;
  processing_time: number;
  sources: Array<{
    source_id: string;
    source_name: string;
    news_fetched: number;
    new_news: number;
    duplicates: number;
    errors: string[];
  }>;
}

export interface RssSourceQuery {
  page?: number;
  limit?: number;
  category_id?: string;
  is_active?: boolean;
  search?: string;
}

export interface RssSourcesResponse {
  sources: RssSource[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
} 