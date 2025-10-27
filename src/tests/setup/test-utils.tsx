import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import type { ReactElement } from 'react'

// QueryClient configuration for tests
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// Helper to render with QueryClient
export const renderWithQueryClient = (
  component: ReactElement,
  queryClient?: QueryClient,
) => {
  const testQueryClient = queryClient || createTestQueryClient()

  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        {component}
      </QueryClientProvider>,
    ),
    queryClient: testQueryClient,
  }
}

// Helper to mock useSearch with the ability to override values
export const createMockUseSearch = (defaultValues = {}) => {
  return vi.fn(() => ({
    title: '',
    categoryId: 0,
    price_min: 0,
    price_max: 9999,
    offset: 0,
    sortBy: 'title',
    sortOrder: 'asc',
    page: 1,
    ...defaultValues,
  }))
}
