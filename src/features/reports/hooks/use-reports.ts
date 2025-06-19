import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createReport,
  getReports,
  getReport,
  reviewReport,
  deleteReport,
  bulkActionReports,
  getReportsStatistics,
} from '../services/reports-api';
import type {
  CreateReportRequest,
  ReportsListParams,
  ReviewReportRequest,
  BulkActionRequest,
} from '../types';

// Şikayet oluşturma hook'u
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      toast.success('Şikayet başarıyla gönderildi');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Şikayet gönderilirken hata oluştu');
    },
  });
};

// Şikayetleri listeleme hook'u
export const useReports = (params: ReportsListParams = {}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getReports(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Şikayet detayı hook'u
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => getReport(id),
    enabled: !!id,
  });
};

// Şikayet değerlendirme hook'u
export const useReviewReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewReportRequest }) =>
      reviewReport(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Şikayet başarıyla değerlendirildi');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
      queryClient.invalidateQueries({ queryKey: ['reports-statistics'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Değerlendirme sırasında hata oluştu');
    },
  });
};

// Şikayet silme hook'u
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      toast.success('Şikayet başarıyla silindi');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-statistics'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Silme işlemi sırasında hata oluştu');
    },
  });
};

// Toplu işlem hook'u
export const useBulkActionReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkActionReports,
    onSuccess: (data) => {
      toast.success(
        `${data.successful} şikayet başarıyla işlendi${
          data.failed > 0 ? `, ${data.failed} işlem başarısız` : ''
        }`
      );
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-statistics'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Toplu işlem sırasında hata oluştu');
    },
  });
};

// İstatistikler hook'u
export const useReportsStatistics = () => {
  return useQuery({
    queryKey: ['reports-statistics'],
    queryFn: getReportsStatistics,
    staleTime: 10 * 60 * 1000, // 10 dakika
  });
}; 