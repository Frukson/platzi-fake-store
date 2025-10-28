import { useProductsFilters } from '@/hooks/useProductFilters'
import { Link, useNavigate } from '@tanstack/react-router'

interface ProductActionsProps {
  productId: number
  onDelete: () => void
}

export default function ProductActions({
  productId,
  onDelete,
}: ProductActionsProps) {
  const { getFilters } = useProductsFilters()
  const navigate = useNavigate()

  const handleBack = () => {
    const savedFilters = getFilters()
    navigate({
      to: '/',
      search: savedFilters || undefined,
    })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/products/$productId/edit"
          params={{ productId: productId.toString() }}
          className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          state={{ from: 'product-card' }}
        >
          Edit product
        </Link>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-50 text-red-600 text-center py-3 px-6 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to product list
        </button>
      </div>
    </>
  )
}
