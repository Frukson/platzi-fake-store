import { useMemo } from 'react'
import type { Product } from '@/types/product.types'

interface UseProductSortParams {
  products: Product[]
  sortBy: 'title' | 'price'
  sortOrder: 'asc' | 'desc'
}

export function useProductSort({
  products,
  sortBy,
  sortOrder,
}: UseProductSortParams) {
  return useMemo(() => {
    const sorted = [...products]
    sorted.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      } else {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      }
    })
    return sorted
  }, [products, sortBy, sortOrder])
}
