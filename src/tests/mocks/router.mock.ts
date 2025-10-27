import { vi } from 'vitest'
import React from 'react'

export const routerMock = {
  createFileRoute: vi.fn(() => () => ({
    component: vi.fn(),
  })),
  useSearch: vi.fn(() => ({
    title: '',
    categoryId: 0,
    price_min: 0,
    price_max: 9999,
    offset: 0,
    sortBy: 'title',
    sortOrder: 'asc',
    page: 1,
  })),
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ children, to, ...props }: any) => 
    React.createElement('a', { href: to, ...props }, children),
}