import axios, { AxiosError } from 'axios'

const API_BASE_URL = 'https://api.escuelajs.co/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token to headers if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log(error.response.status,'testt')
      const isAuthRequest = error.config?.url?.includes('/auth/login')
      
      const currentPath = window.location.pathname
      const isLoginPage = currentPath === '/login';
      
      if (!isAuthRequest) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        
        // Authorization invalid, redirect to login page
        if (!isLoginPage) {
          localStorage.setItem('was_unauthorized', 'true')
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
