import { Link } from '@tanstack/react-router'

interface ProductBreadcrumbProps {
  productTitle: string
}

export default function ProductBreadcrumb({
  productTitle,
}: ProductBreadcrumbProps) {
  return (
    <div className="mb-6 flex items-center space-x-2 text-sm">
      <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
        Products
      </Link>
      <span className="text-gray-400">›</span>
      <span className="text-gray-900">{productTitle}</span>
    </div>
  )
}
