import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product.types'

interface ProductCardProps {
  product: Product
  onDelete?: (productId: number, productTitle: string) => void
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div
      data-testid="product-card"
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      {/* Product Image */}
      <Link
        to="/products/$productId"
        params={{ productId: product.id.toString() }}
        className="relative h-48 bg-gray-100 overflow-hidden block"
        tabIndex={-1}
        aria-label={product.title}
        data-testid="product-image-link"
      >
        <img
          data-testid="product-image"
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x200?text=No%20image'
          }}
        />
        <div
          data-testid="product-price"
          className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-md"
        >
          ${product.price}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span
            data-testid="product-category-badge"
            className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded"
          >
            {product.category.name}
          </span>
        </div>
        <h3
          data-testid="product-title"
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-14"
        >
          {product.title}
        </h3>
        <p
          data-testid="product-description"
          className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10"
        >
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link
            data-testid="product-view-link"
            to="/products/$productId"
            params={{ productId: product.id.toString() }}
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View
          </Link>
          <Link
            data-testid="product-edit-link"
            to="/products/$productId/edit"
            params={{ productId: product.id.toString() }}
            className="flex-1 bg-gray-200 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Edit
          </Link>
          <button
            data-testid="product-delete-button"
            onClick={() => onDelete?.(product.id, product.title)}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete product"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
