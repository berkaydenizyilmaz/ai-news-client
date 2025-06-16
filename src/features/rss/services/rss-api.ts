import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { logService } from '@/lib/log-service';
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

/**
 * RSS API fonksiyonları
 * RSS kaynak yönetimi ve feed çekme işlemleri için kullanılır
 */
const rssApi = {
  /**
   * RSS kaynaklarını listeler (sayfalama ve filtreleme ile)
   * @param params - Sorgu parametreleri
   * @returns RSS kaynakları listesi ile Promise
   */
  getRssSources: async (params?: RssSourceQuery): Promise<ApiResponse<RssSourcesResponse>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
    if (params?.search) searchParams.append('search', params.search);

    const response = await apiClient.get<ApiResponse<RssSourcesResponse>>(
      `/rss/sources?${searchParams.toString()}`
    );
    
    return response.data;
  },

  /**
   * Belirli bir RSS kaynağını ID'ye göre getirir
   * @param id - RSS kaynak ID'si
   * @returns RSS kaynak verisi ile Promise
   */
  getRssSourceById: async (id: string): Promise<ApiResponse<RssSource>> => {
    const response = await apiClient.get<ApiResponse<RssSource>>(`/rss/sources/${id}`);
    return response.data;
  },

  /**
   * Yeni RSS kaynağı oluşturur
   * @param data - RSS kaynak oluşturma verisi
   * @returns Oluşturulan RSS kaynak ile Promise
   */
  createRssSource: async (data: CreateRssSourceRequest): Promise<ApiResponse<RssSource>> => {
    try {
      const response = await apiClient.post<ApiResponse<RssSource>>('/rss/sources', data);
      
      // Başarılı oluşturma logu
      if (response.data.success) {
        await logService.info('rss', 'Yeni RSS kaynağı oluşturuldu', {
          name: data.name,
          url: data.url,
          source_id: response.data.data?.id
        });
      }
      
      return response.data;
    } catch (error) {
      // Başarısız oluşturma logu
      await logService.error('rss', 'RSS kaynağı oluşturma başarısız', {
        name: data.name,
        url: data.url,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      throw error;
    }
  },

  /**
   * RSS kaynağını günceller
   * @param id - RSS kaynak ID'si
   * @param data - Güncelleme verisi
   * @returns Güncellenmiş RSS kaynak ile Promise
   */
  updateRssSource: async (id: string, data: UpdateRssSourceRequest): Promise<ApiResponse<RssSource>> => {
    try {
      const response = await apiClient.put<ApiResponse<RssSource>>(`/rss/sources/${id}`, data);
      
      // Başarılı güncelleme logu
      if (response.data.success) {
        await logService.info('rss', 'RSS kaynağı güncellendi', {
          source_id: id,
          updated_fields: Object.keys(data).join(', ')
        });
      }
      
      return response.data;
    } catch (error) {
      // Başarısız güncelleme logu
      await logService.error('rss', 'RSS kaynağı güncelleme başarısız', {
        source_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      throw error;
    }
  },

  /**
   * RSS kaynağını siler
   * @param id - RSS kaynak ID'si
   * @returns Silme sonucu ile Promise
   */
  deleteRssSource: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/rss/sources/${id}`);
      
      // Başarılı silme logu
      if (response.data.success) {
        await logService.info('rss', 'RSS kaynağı silindi', { source_id: id });
      }
      
      return response.data;
    } catch (error) {
      // Başarısız silme logu
      await logService.error('rss', 'RSS kaynağı silme başarısız', {
        source_id: id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      throw error;
    }
  },

  /**
   * RSS kaynaklarından haberleri çeker
   * @param data - Feed çekme parametreleri
   * @returns Feed çekme sonucu ile Promise
   */
  fetchRssFeeds: async (data?: RssFetchRequest): Promise<ApiResponse<RssFetchResult>> => {
    try {
      const response = await apiClient.post<ApiResponse<RssFetchResult>>('/rss/fetch', data || {});
      
      // Başarılı feed çekme logu
      if (response.data.success) {
        await logService.info('rss', 'RSS feed çekme işlemi tamamlandı', {
          source_id: data?.source_id,
          max_items: data?.max_items,
          force_refresh: data?.force_refresh,
          total_fetched: response.data.data?.total_news_fetched
        });
      }
      
      return response.data;
    } catch (error) {
      // Başarısız feed çekme logu
      await logService.error('rss', 'RSS feed çekme başarısız', {
        source_id: data?.source_id,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      throw error;
    }
  },
};

// Query Keys
export const rssKeys = {
  all: ['rss'] as const,
  sources: () => [...rssKeys.all, 'sources'] as const,
  sourcesList: (params?: RssSourceQuery) => [...rssKeys.sources(), 'list', params] as const,
  source: (id: string) => [...rssKeys.sources(), 'detail', id] as const,
};

// TanStack Query Hooks

/**
 * RSS kaynaklarını getirmek için TanStack Query hook'u
 * @param params - Sorgu parametreleri
 * @returns RSS kaynakları listesi için query nesnesi
 */
export const useRssSources = (params?: RssSourceQuery) => {
  return useQuery({
    queryKey: rssKeys.sourcesList(params),
    queryFn: async (): Promise<RssSourcesResponse> => {
      const response = await rssApi.getRssSources(params);
      return response.data!;
    },
    staleTime: 30000, // 30 saniye
  });
};

/**
 * Belirli bir RSS kaynağını getirmek için TanStack Query hook'u
 * @param id - RSS kaynak ID'si
 * @returns RSS kaynak verisi için query nesnesi
 */
export const useRssSource = (id: string) => {
  return useQuery({
    queryKey: rssKeys.source(id),
    queryFn: async (): Promise<RssSource> => {
      const response = await rssApi.getRssSourceById(id);
      return response.data!;
    },
    enabled: !!id,
  });
};

/**
 * Yeni RSS kaynağı oluşturmak için TanStack Query mutation hook'u (Admin Only)
 * @returns RSS kaynak oluşturma işlemi için mutation nesnesi
 */
export const useCreateRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRssSourceRequest): Promise<RssSource> => {
      const response = await rssApi.createRssSource(data);
      return response.data!;
    },
    mutationKey: ['rss', 'sources', 'create'],
    onSuccess: () => {
      // Invalidate and refetch RSS sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

/**
 * RSS kaynağını güncellemek için TanStack Query mutation hook'u (Admin Only)
 * @returns RSS kaynak güncelleme işlemi için mutation nesnesi
 */
export const useUpdateRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRssSourceRequest }): Promise<RssSource> => {
      const response = await rssApi.updateRssSource(id, data);
      return response.data!;
    },
    mutationKey: ['rss', 'sources', 'update'],
    onSuccess: (data, variables) => {
      // Update specific source in cache
      queryClient.setQueryData(rssKeys.source(variables.id), { success: true, data });
      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

/**
 * RSS kaynağını silmek için TanStack Query mutation hook'u (Admin Only)
 * @returns RSS kaynak silme işlemi için mutation nesnesi
 */
export const useDeleteRssSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await rssApi.deleteRssSource(id);
    },
    mutationKey: ['rss', 'sources', 'delete'],
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: rssKeys.source(id) });
      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
};

/**
 * RSS feed çekmek için TanStack Query mutation hook'u (Admin Only)
 * @returns RSS feed çekme işlemi için mutation nesnesi
 */
export const useFetchRssFeeds = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data?: RssFetchRequest): Promise<RssFetchResult> => {
      const response = await rssApi.fetchRssFeeds(data);
      return response.data!;
    },
    mutationKey: ['rss', 'feeds', 'fetch'],
    onSuccess: () => {
      // Invalidate RSS sources to update last_fetched_at
      queryClient.invalidateQueries({ queryKey: rssKeys.sources() });
    },
  });
}; 