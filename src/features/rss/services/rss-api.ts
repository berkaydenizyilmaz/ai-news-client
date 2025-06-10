import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types';
import type {
  RssSource,
  RssSourcesResponse,
  CreateRssSourceRequest,
  UpdateRssSourceRequest,
  RssFetchRequest,
  RssFetchResult,
  RssSourceQuery,
} from '../types';

// Query Keys
export const rssKeys = {
  all: ['rss'] as const,
  sources: () => [...rssKeys.all, 'sources'] as const,
  sourcesList: (params?: RssSourceQuery) => [...rssKeys.sources(), 'list', params] as const,
  source: (id: string) => [...rssKeys.sources(), 'detail', id] as const,
};

// Public RSS Sources Query
export const useRssSources = (params?: RssSourceQuery) => {
  return useQuery({
    queryKey: rssKeys.sourcesList(params),
    queryFn: async (): Promise<RssSourcesResponse> => {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
      if (params?.search) searchParams.append('search', params.search);

      const response = await apiClient.get<ApiResponse<RssSourcesResponse>>(
        `/rss/sources?${searchParams.toString()}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'RSS kaynakları getirilemedi');
      }
      
      return response.data.data;
    },
  });
};

// Get Single RSS Source Query
export const useRssSource = (id: string) => {
  return useQuery({
    queryKey: rssKeys.source(id),
    queryFn: async (): Promise<RssSource> => {
      const response = await apiClient.get<ApiResponse<RssSource>>(`/rss/sources/${id}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'RSS kaynağı bulunamadı');
      }
      
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create RSS Source Mutation (Admin Only)
export const useCreateRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRssSourceRequest): Promise<RssSource> => {
      const response = await apiClient.post<ApiResponse<RssSource>>('/rss/sources', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'RSS kaynağı oluşturulamadı');
      }
      
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch RSS sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

// Update RSS Source Mutation (Admin Only)
export const useUpdateRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRssSourceRequest }): Promise<RssSource> => {
      const response = await apiClient.put<ApiResponse<RssSource>>(`/rss/sources/${id}`, data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'RSS kaynağı güncellenemedi');
      }
      
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Update specific source in cache
      queryClient.setQueryData(rssKeys.source(variables.id), data);
      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

// Delete RSS Source Mutation (Admin Only)
export const useDeleteRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await apiClient.delete<ApiResponse<void>>(`/rss/sources/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'RSS kaynağı silinemedi');
      }
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: rssKeys.source(id) });
      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

// Fetch RSS Feeds Mutation (Admin Only)
export const useFetchRssFeeds = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data?: RssFetchRequest): Promise<RssFetchResult> => {
      const response = await apiClient.post<ApiResponse<RssFetchResult>>('/rss/fetch', data || {});
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'RSS çekme işlemi başarısız');
      }
      
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate RSS sources to update last_fetched_at
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
}; 