interface ProductDetailsProps {
  id: number
  categoryName: string
}

export default function ProductDetails({
  id,
  categoryName,
}: ProductDetailsProps) {
  return (
    <div className="border-t border-gray-200 pt-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Product details
      </h2>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-gray-600">Product ID:</dt>
          <dd className="text-gray-900 font-medium">#{id}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Category:</dt>
          <dd className="text-gray-900 font-medium">{categoryName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Availability:</dt>
          <dd className="text-green-600 font-medium">Available</dd>
        </div>
      </dl>
    </div>
  )
}
