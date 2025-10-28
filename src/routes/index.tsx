import {
  createFileRoute,
  useSearch,
  useNavigate,
  Link,
} from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts, getCategories } from '@/api/products'
import type { ProductsQueryParams } from '@/types/product.types'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import Pagination from '@/components/products/Pagination'
import EmptyState from '@/components/products/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { useProductSort } from '@/hooks/useProductSort'
import { z } from 'zod'
import DeleteProductModal from '@/components/modals/DeleteProductModal'

export const ITEMS_PER_PAGE = 12

export const defaultSearchParams = {
  title: '',
  categoryId: 0,
  offset: 0,
  sortBy: 'title',
  sortOrder: 'asc',
  page: 1,
} as const

export const productsSearchParamsSchema = z.object({
  title: z.string().max(100).default(defaultSearchParams.title),
  categoryId: z.coerce.number().min(0).default(defaultSearchParams.categoryId),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  offset: z.coerce.number().min(0).default(defaultSearchParams.offset),
  page: z.coerce.number().min(1).default(defaultSearchParams.page),
  sortBy: z.string().default(defaultSearchParams.sortBy),
  sortOrder: z.string().default(defaultSearchParams.sortOrder),
})

export type ProductsSearchParams = z.infer<typeof productsSearchParamsSchema>

export const Route = createFileRoute('/')({
  validateSearch: productsSearchParamsSchema,
  component: ProductsPage,
})

export function ProductsPage() {
  const filters = useSearch({ from: Route.id })
  const navigate = useNavigate({ from: Route.id })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteProductData, setDeleteProductData] = useState<{
    id: number
    title: string
  } | null>(null)

  const updateFilters = useCallback(
    (newFilters: Partial<ProductsSearchParams>, resetPage = true) => {
      navigate({
        search: (prev: ProductsSearchParams) => {
          const updated = { ...prev, ...newFilters }

          // Reset page to 1 when filters change (unless explicitly disabled)
          if (resetPage && !newFilters.hasOwnProperty('page')) {
            updated.page = 1
          }

          // Clean up empty values
          const cleaned = Object.fromEntries(
            Object.entries(updated).filter(([_, value]) => {
              return value !== '' && value !== undefined
            }),
          )

          return cleaned as ProductsSearchParams
        },
        replace: true,
      })
    },
    [navigate],
  )

  // Build query params
  const queryParams = useMemo<ProductsQueryParams>(() => {
    return {
      title: filters.title || undefined,
      categoryId: filters.categoryId,
      price_min: filters.price_min,
      price_max: filters.price_max,
      offset: (filters.page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    }
  }, [
    filters.title,
    filters.categoryId,
    filters.price_min,
    filters.price_max,
    filters.page,
  ])

  // Fetch products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
    staleTime: 10 * 1000,
  })

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const sortedProducts = useProductSort({
    products,
    sortBy: filters.sortBy as 'title' | 'price',
    sortOrder: filters.sortOrder as 'asc' | 'desc',
  })

  const resetFilters = useCallback(() => {
    updateFilters(defaultSearchParams, false)
  }, [updateFilters])

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex-1 flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <div className="mb-4 flex justify-start">
          <Link
            data-testid="create-product-button"
            to="/products/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Product
          </Link>
        </div>
        <ProductFilters
          title={filters.title}
          categoryId={filters.categoryId}
          priceMin={filters.price_min}
          priceMax={filters.price_max}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          categories={categories}
          onTitleChange={(value) => updateFilters({ title: value })}
          onCategoryChange={(value) => updateFilters({ categoryId: value })}
          onPriceMinChange={(value) => updateFilters({ price_min: value })}
          onPriceMaxChange={(value) => updateFilters({ price_max: value })}
          onSortByChange={(value) => updateFilters({ sortBy: value }, false)}
          onSortOrderToggle={() =>
            updateFilters(
              {
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              },
              false,
            )
          }
          onReset={resetFilters}
        />

        {isLoadingProducts && <LoadingSpinner message="Loading products..." />}

        {productsError && (
          <ErrorMessage
            headerMessage="Not products found"
            message={'Reset filter or try again later.'}
          />
        )}

        {!isLoadingProducts &&
          !productsError &&
          sortedProducts.length === 0 && <EmptyState onReset={resetFilters} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {!isLoadingProducts &&
            !productsError &&
            sortedProducts.length > 0 &&
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={(productId, productTitle) => {
                  setDeleteProductData({ id: productId, title: productTitle })
                  setIsDeleteModalOpen(true)
                }}
              />
            ))}
        </div>
        <Pagination
          currentPage={filters.page}
          hasMore={products.length >= ITEMS_PER_PAGE}
          onPageChange={(page) => updateFilters({ page }, false)}
        />
      </div>
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={deleteProductData?.id ?? 0}
        productName={deleteProductData?.title ?? ''}
      />
    </div>
  )
}
