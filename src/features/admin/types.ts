// RSS Feature Types
export interface RssSource {
  id: string;
  name: string;
  url: string;
  description?: string;
  is_active: boolean;
  last_fetched_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRssSourceRequest {
  name: string;
  url: string;
  description?: string;
}

export interface UpdateRssSourceRequest {
  name?: string;
  url?: string;
  description?: string;
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
  is_active?: boolean;
  search?: string;
}

export interface RssSourcesResponse {
  sources: RssSource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Log Feature Types
export interface Log {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: 'auth' | 'rss' | 'news' | 'settings' | 'forum' | 'users' | 'reports' | 'notification';
  message: string;
  details?: Record<string, unknown>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface LogsResponse {
  logs: Log[];
  pagination: PaginationInfo;
}

export interface LogQuery {
  page?: number;
  limit?: number;
  level?: 'info' | 'warning' | 'error' | 'debug';
  module?: 'auth' | 'rss' | 'news' | 'settings' | 'forum' | 'users' | 'reports' | 'notification';
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface LogStats {
  total_logs: number;
  logs_by_level: {
    info: number;
    warning: number;
    error: number;
    debug: number;
  };
  logs_by_module: {
    auth: number;
    rss: number;
    news: number;
    settings: number;
    forum: number;
    users: number;
    reports: number;
    notification: number;
  };
  recent_activity: Array<{
    date: string;
    count: number;
  }>;
}

export interface LogStatsQuery {
  days?: number;
  level?: 'info' | 'warning' | 'error' | 'debug';
  module?: 'auth' | 'rss' | 'news' | 'settings' | 'forum' | 'users' | 'reports' | 'notification';
}

export interface ClearLogsRequest {
  older_than_days?: number;
  level?: 'info' | 'warning' | 'error' | 'debug';
  module?: 'auth' | 'rss' | 'news' | 'settings' | 'forum' | 'users' | 'reports' | 'notification';
}

export interface ClearLogsResponse {
  deleted_count: number;
  message: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 