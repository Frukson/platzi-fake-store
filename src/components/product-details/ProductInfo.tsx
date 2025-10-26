interface ProductInfoProps {
  title: string
  price: number
  categoryName: string
  description: string
}

export default function ProductInfo({
  title,
  price,
  categoryName,
  description,
}: ProductInfoProps) {
  return (
    <>
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
          {categoryName}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
      </div>

      <div className="mb-8 grow">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Description
        </h2>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </>
  )
}
