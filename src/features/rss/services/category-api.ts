import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types';
import type { NewsCategory } from '../types';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

// Get Categories Query (Public)
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async (): Promise<NewsCategory[]> => {
      const response = await apiClient.get<ApiResponse<NewsCategory[]>>('/categories');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Kategoriler getirilemedi');
      }
      
      return response.data.data;
    },
  });
}; 