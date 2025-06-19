import { apiClient } from '@/lib/api-client';
import type {
  CreateReportRequest,
  Report,
  ReportsListResponse,
  ReportsListParams,
  ReviewReportRequest,
  BulkActionRequest,
  BulkActionResponse,
  ReportsStatistics,
} from '../types';

// Şikayet oluşturma
export const createReport = async (data: CreateReportRequest): Promise<Report> => {
  const response = await apiClient.post('/reports', data);
  return response.data.data;
};

// Şikayetleri listeleme
export const getReports = async (params: ReportsListParams = {}): Promise<ReportsListResponse> => {
  const response = await apiClient.get('/reports', { params });
  return response.data.data;
};

// Şikayet detayı
export const getReport = async (id: string): Promise<Report> => {
  const response = await apiClient.get(`/reports/${id}`);
  return response.data.data;
};

// Şikayet değerlendirme
export const reviewReport = async (id: string, data: ReviewReportRequest): Promise<Report> => {
  const response = await apiClient.put(`/reports/${id}/review`, data);
  return response.data.data;
};

// Şikayet silme
export const deleteReport = async (id: string): Promise<void> => {
  await apiClient.delete(`/reports/${id}`);
};

// Toplu işlem
export const bulkActionReports = async (data: BulkActionRequest): Promise<BulkActionResponse> => {
  const response = await apiClient.post('/reports/bulk-action', data);
  return response.data.data;
};

// İstatistikler
export const getReportsStatistics = async (): Promise<ReportsStatistics> => {
  const response = await apiClient.get('/reports/statistics');
  return response.data.data;
}; 