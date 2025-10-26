import apiClient from "@/lib/axios"
import type { User } from "@/types/user.types"

  const endpoints = {
    profile: '/auth/profile',
  }

export const getUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>(endpoints.profile)
  return data
}