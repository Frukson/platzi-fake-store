import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProduct } from '@/api/products'
import { useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import ProductBreadcrumb from '@/components/product-details/ProductBreadcrumb'
import ProductGallery from '@/components/product-details/ProductGallery'
import ProductInfo from '@/components/product-details/ProductInfo'
import ProductDetails from '@/components/product-details/ProductDetails'
import ProductActions from '@/components/product-details/ProductActions'
import DeleteProductModal from '@/components/modals/DeleteProductModal'
import { productsCacheTime } from '@/constants/globalConfig'

export const Route = createFileRoute('/products/$productId/')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { productId } = Route.useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(Number(productId)),
    staleTime: productsCacheTime,
  })

  if (isLoading) {
    return <LoadingSpinner message="Loading product..." />
  }

  if (error || !product) {
    return (
      <ErrorMessage
        headerMessage="Error loading product"
        message="Product not found"
      />
    )
  }

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductBreadcrumb productTitle={product.title} />

        {/* Main product card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductGallery
              images={product.images}
              title={product.title}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />

            <div className="p-8 flex flex-col">
              <ProductInfo
                title={product.title}
                price={product.price}
                categoryName={product.category.name}
                description={product.description}
              />

              <ProductDetails
                id={product.id}
                categoryName={product.category.name}
              />

              <ProductActions
                productId={product.id}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={product.id}
        productName={product.title}
      />
    </div>
  )
}
