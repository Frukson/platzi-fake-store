import type { Category } from '@/types/product.types'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { defaultSearchParams } from '@/routes'

interface ProductFiltersProps {
  title: string
  categoryId: number
  priceMin: number | undefined
  priceMax: number | undefined
  sortBy: string
  sortOrder: string
  categories: Category[]
  onTitleChange: (value: string) => void
  onCategoryChange: (value: number) => void
  onPriceMinChange: (value: number | undefined) => void
  onPriceMaxChange: (value: number | undefined) => void
  onSortByChange: (value: string) => void
  onSortOrderToggle: () => void
  onReset: () => void
}

export default function ProductFilters({
  title,
  categoryId,
  priceMin,
  priceMax,
  sortBy,
  sortOrder,
  categories,
  onTitleChange,
  onCategoryChange,
  onPriceMinChange,
  onPriceMaxChange,
  onSortByChange,
  onSortOrderToggle,
  onReset,
}: ProductFiltersProps) {
  const [localTitle, handleTitleChange] = useDebouncedValue(
    title,
    onTitleChange,
  )

  const [localPriceMin, handlePriceMinChange] = useDebouncedValue(
    priceMin,
    onPriceMinChange,
  )

  const [localPriceMax, handlePriceMaxChange] = useDebouncedValue(
    priceMax,
    onPriceMaxChange,
  )

  const handleReset = () => {
    onReset()
    handlePriceMaxChange(undefined)
    handlePriceMinChange(undefined)
    handleTitleChange(defaultSearchParams.title)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by title
          </label>
          <input
            data-testid="filter-search-input"
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            data-testid="filter-category-select"
            value={categoryId}
            onChange={(e) => onCategoryChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value={0}>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price ($)
          </label>
          <input
            data-testid="filter-min-price-input"
            type="number"
            value={localPriceMin ?? ''}
            onChange={(e) =>
              handlePriceMinChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="Min price..."
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price ($)
          </label>
          <input
            data-testid="filter-max-price-input"
            type="number"
            value={localPriceMax ?? ''}
            onChange={(e) =>
              handlePriceMaxChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="Max price..."
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200 gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            data-testid="filter-sort-by-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>
          <button
            data-testid="filter-sort-order-button"
            onClick={onSortOrderToggle}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
        <button
          data-testid="filter-reset-button"
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
