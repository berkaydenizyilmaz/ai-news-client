export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export type ReportedType = 'news' | 'comment' | 'forum_post' | 'forum_topic';

export interface CreateReportRequest {
  reported_type: ReportedType;
  reported_id: string;
  reason: string;
  description?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_type: ReportedType;
  reported_id: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  reporter?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  reviewer?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface ReportsListResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportsListParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  reported_type?: ReportedType;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface ReviewReportRequest {
  status: 'reviewed' | 'resolved' | 'dismissed';
  review_notes?: string;
}

export interface BulkActionRequest {
  report_ids: string[];
  action: 'resolved' | 'dismissed';
  review_notes?: string;
}

export interface BulkActionResponse {
  total_processed: number;
  successful: number;
  failed: number;
  errors: string[];
}

export interface ReportsStatistics {
  total_reports: number;
  pending_reports: number;
  reviewed_reports: number;
  resolved_reports: number;
  dismissed_reports: number;
  reports_by_type: {
    news: number;
    comment: number;
    forum_post: number;
    forum_topic: number;
  };
  recent_reports: Array<{
    id: string;
    reason: string;
    status: ReportStatus;
    created_at: string;
    reporter: {
      username: string;
    };
  }>;
} 