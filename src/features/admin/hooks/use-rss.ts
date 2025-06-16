import { useAuthStore } from '@/store/auth-store';
import {
  useRssSources,
  useRssSource,
  useCreateRssSource,
  useUpdateRssSource,
  useDeleteRssSource,
  useFetchRssFeeds,
} from '../services/rss-api';
import type { CreateRssSourceRequest, UpdateRssSourceRequest, RssFetchRequest } from '../types';

// RSS yönetimi için merkezi hook
// Admin yetki kontrolü ve helper fonksiyonlar sağlar
export const useRssManager = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Admin mutations
  const createRssSource = useCreateRssSource();
  const updateRssSource = useUpdateRssSource();
  const deleteRssSource = useDeleteRssSource();
  const fetchRssFeeds = useFetchRssFeeds();

  // Helper functions
  const handleCreateSource = async (data: CreateRssSourceRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir');
    }
    return createRssSource.mutateAsync(data);
  };

  const handleUpdateSource = async (id: string, data: UpdateRssSourceRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir');
    }
    return updateRssSource.mutateAsync({ id, data });
  };

  const handleDeleteSource = async (id: string) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir');
    }
    return deleteRssSource.mutateAsync(id);
  };

  const handleFetchFeeds = async (data?: RssFetchRequest) => {
    if (!isAdmin) {
      throw new Error('Bu işlem için admin yetkisi gereklidir');
    }
    return fetchRssFeeds.mutateAsync(data);
  };

  return {
    // Hook functions for queries (to be used directly in components)
    useRssSources,
    useRssSource,
    
    // Mutations with admin checks
    createRssSource: {
      ...createRssSource,
      mutateAsync: handleCreateSource,
    },
    updateRssSource: {
      ...updateRssSource,
      mutateAsync: handleUpdateSource,
    },
    deleteRssSource: {
      ...deleteRssSource,
      mutateAsync: handleDeleteSource,
    },
    fetchRssFeeds: {
      ...fetchRssFeeds,
      mutateAsync: handleFetchFeeds,
    },
    
    // Utils
    isAdmin,
  };
}; 