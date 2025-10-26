interface ProductGalleryProps {
  images: string[]
  title: string
  selectedImage: number
  onImageSelect: (index: number) => void
}

export default function ProductGallery({
  images,
  title,
  selectedImage,
  onImageSelect,
}: ProductGalleryProps) {
  return (
    <div className="p-8">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
        <img
          src={images[selectedImage] || images[0]}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x600?text=No+image'
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 transition-all ${
                selectedImage === index
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://placehold.co/200x200?text=No+image'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
