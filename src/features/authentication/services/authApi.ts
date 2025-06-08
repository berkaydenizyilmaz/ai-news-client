import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'
import type { ApiResponse } from '@/lib/types'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types'

// API fonksiyonları
const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },
}

// TanStack Query Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    mutationKey: ['auth', 'login'],
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    mutationKey: ['auth', 'register'],
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: false, // Manuel olarak çağırılacak
  })
} 