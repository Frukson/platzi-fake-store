import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import Pagination from '@/components/products/Pagination'
import { PaginationPageObject } from './pages/PaginationPageObject'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()
  let page: PaginationPageObject

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPagination = (props = {}) => {
    const defaultProps = {
      currentPage: 1,
      hasMore: true,
      onPageChange: mockOnPageChange,
    }

    render(<Pagination {...defaultProps} {...props} />)
    page = new PaginationPageObject()
  }

  it('renders all pagination elements with correct page number', () => {
    renderPagination({ currentPage: 3 })

    page.expectPaginationVisible()
    page.expectCurrentPage(3)
    expect(page.previousButton).toBeInTheDocument()
    expect(page.nextButton).toBeInTheDocument()
  })

  it('handles first page state correctly', () => {
    renderPagination({ currentPage: 1, hasMore: true })

    page.expectCurrentPage(1)
    page.expectPreviousButtonDisabled()
    page.expectNextButtonEnabled()
  })

  it('handles last page state correctly', () => {
    renderPagination({ currentPage: 5, hasMore: false })

    page.expectCurrentPage(5)
    page.expectPreviousButtonEnabled()
    page.expectNextButtonDisabled()
  })

  it('handles middle page with both buttons enabled', () => {
    renderPagination({ currentPage: 3, hasMore: true })

    page.expectBothButtonsEnabled()
  })

  it('handles single page scenario with both buttons disabled', () => {
    renderPagination({ currentPage: 1, hasMore: false })

    page.expectPreviousButtonDisabled()
    page.expectNextButtonDisabled()
  })

  it('calls onPageChange when clicking Next button', async () => {
    renderPagination({ currentPage: 2 })

    await page.clickNext()

    expect(mockOnPageChange).toHaveBeenCalledTimes(1)
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when clicking Previous button', async () => {
    renderPagination({ currentPage: 3 })

    await page.clickPrevious()

    expect(mockOnPageChange).toHaveBeenCalledTimes(1)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('navigates correctly with sequential clicks', async () => {
    renderPagination({ currentPage: 2, hasMore: true })

    await page.clickNext()
    expect(mockOnPageChange).toHaveBeenLastCalledWith(3)

    await page.clickPrevious()
    expect(mockOnPageChange).toHaveBeenLastCalledWith(1)

    expect(mockOnPageChange).toHaveBeenCalledTimes(2)
  })
})
