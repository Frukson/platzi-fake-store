import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import ProductCard from '@/components/products/ProductCard'
import { ProductCardPageObject } from './pages/ProductCardPageObject'
import React from 'react'

// Mock router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params, ...props }: any) => {
    const href = to.replace('$productId', params?.productId || '')
    return React.createElement('a', { href, ...props }, children)
  },
}))

describe('ProductCard', () => {
  let page: ProductCardPageObject

  const mockProduct = {
    id: 123,
    title: 'Test Product',
    description: 'This is a test product description',
    price: 99.99,
    images: ['https://example.com/image.jpg'],
    creationAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    category: {
      id: 1,
      name: 'Electronics',
      image: 'https://example.com/category.jpg',
      creationAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  }

  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderCard = (props = {}) => {
    render(
      <ProductCard product={mockProduct} onDelete={mockOnDelete} {...props} />,
    )
    page = new ProductCardPageObject()
  }

  it('renders all product card elements', () => {
    renderCard()

    page.expectAllElementsVisible()
  })

  it('displays correct product information', () => {
    renderCard()

    page.expectProductInfo(mockProduct)
  })

  it('displays product image with correct src', () => {
    renderCard()

    expect(page.image).toHaveAttribute('src', mockProduct.images[0])
    expect(page.image).toHaveAttribute('alt', mockProduct.title)
  })

  it('has correct links for view and edit', () => {
    renderCard()

    page.expectCorrectLinks(mockProduct.id)
  })

  it('calls onDelete with correct parameters when delete button is clicked', async () => {
    renderCard()

    await page.clickDelete()

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id, mockProduct.title)
  })

  it('does not crash when onDelete is not provided', async () => {
    renderCard({ onDelete: undefined })

    await page.clickDelete()

    // Should not throw error
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('shows fallback image when image fails to load', () => {
    renderCard()

    const img = page.image as HTMLImageElement

    // Trigger error event
    const errorEvent = new Event('error')
    img.dispatchEvent(errorEvent)

    expect(img.src).toContain('placehold.co')
  })
})
