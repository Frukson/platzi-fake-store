import type { ProductsSearchParams } from '@/routes'

const FILTERS_KEY = 'products-filters'

export function useProductsFilters() {
  const saveFilters = (filters: ProductsSearchParams) => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters))
  }

  const getFilters = (): ProductsSearchParams | null => {
    try {
      const saved = localStorage.getItem(FILTERS_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  return { saveFilters, getFilters }
}
