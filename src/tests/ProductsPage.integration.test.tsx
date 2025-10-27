import { describe, it, expect, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { ProductsPage } from '@/routes/index'
import { renderWithQueryClient } from './setup/test-utils'
import * as RouterModule from '@tanstack/react-router'
import React from 'react'
import { ProductsPageObject } from './pages/ProductsPageObject'

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
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
}))

describe('ProductsPage', () => {
  const mockUseSearch = vi.mocked(RouterModule.useSearch)
  let page: ProductsPageObject

  const defaultSearchParams = {
    title: '',
    categoryId: 0,
    price_min: 0,
    price_max: 9999,
    offset: 0,
    sortBy: 'title',
    sortOrder: 'asc',
    page: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSearch.mockReturnValue(defaultSearchParams)
  })

  const renderPage = () => {
    renderWithQueryClient(<ProductsPage />)
    page = new ProductsPageObject()
  }

  it('renders all important page elements', async () => {
    renderPage()

    await waitFor(() => {
      page.expectPageElementsVisible()
    })
  })

  it('renders product cards with correct structure', async () => {
    renderPage()

    await waitFor(() => {
      expect(page.productCards.length).toBeGreaterThan(0)
      page.expectProductCardStructure(0)
    })
  })

  it('renders pagination with correct elements', async () => {
    renderPage()

    await waitFor(() => {
      page.expectPaginationVisible()
    })
  })

  it('filters products by category', async () => {
    const mockNavigate = vi.fn()
    vi.mocked(RouterModule.useNavigate).mockReturnValue(mockNavigate)

    renderPage()

    await page.waitForCategoryOption('Electronics')
    await page.waitForProducts()

    await page.selectCategory('79')

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          search: expect.any(Function),
        }),
      )
    })

    const navigateCall = mockNavigate.mock.calls[0][0]
    const newSearch = navigateCall.search(defaultSearchParams)

    expect(newSearch.categoryId).toBe(79)
    expect(newSearch.page).toBe(1)
  })

  it('shows delete modal with correct product name when delete button is clicked', async () => {
    renderPage()

    await page.waitForProducts()

    const productTitle = page.getProductTitle(0) as string

    page.expectDeleteModalNotVisible()

    await page.clickDeleteOnProduct(0)

    await waitFor(() => {
      page.expectDeleteModalVisible()
    })

    page.expectDeleteModalContainsProductName(productTitle)
  })

  it('resets category filter when reset button is clicked', async () => {
    const mockNavigate = vi.fn()

    mockUseSearch.mockReturnValue({
      ...defaultSearchParams,
      categoryId: 79,
    })

    vi.mocked(RouterModule.useNavigate).mockReturnValue(mockNavigate)

    renderPage()

    await waitFor(() => {
      page.expectCategoryValue('79')
    })

    await page.clickResetFilters()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })

    const navigateCall = mockNavigate.mock.calls[0][0]
    const newSearch = navigateCall.search({
      ...defaultSearchParams,
      categoryId: 79,
    })

    expect(newSearch.categoryId).toBe(0)
  })
})
