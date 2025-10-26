import apiClient from '@/lib/axios'
import type { LoginRequest, LoginResponse } from '@/types/login.types'


const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
}

export const postLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    credentials
  )
  
  if (data.access_token) {
    localStorage.setItem('auth_token', data.access_token)
  }
  
  return data
}

export const logoutHandler = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
}
