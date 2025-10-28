import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, getCategories } from '@/api/products'
import type { CreateProductRequest } from '@/types/product.types'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '@/components/forms/FormInput'
import FormSelect from '@/components/forms/FormSelect'
import FormTextArea from '@/components/forms/FormTextArea'
import SubmitButton from '@/components/forms/SubmitButton'
import { z } from 'zod'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { showToast } from '@/utils/toast'
import { useProductsFilters } from '@/hooks/useProductFilters'

const createProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  price: z
    .number('Price must be a number')
    .positive('Price must be greater than 0')
    .min(0.01, 'Price must be at least 0.01'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  categoryId: z
    .number('Category is required')
    .positive('Please select a category'),
  images: z
    .array(
      z
        .string()
        .refine(
          (val) => val === '' || z.string().url().safeParse(val).success,
          { message: 'Please enter a valid URL or leave empty' },
        ),
    )
    .refine((images) => images.some((img) => img.trim() !== ''), {
      message: 'At least one image is required',
    }),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

export const Route = createFileRoute('/products/new/')({
  component: CreateProductPage,
})

function CreateProductPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { getFilters } = useProductsFilters()

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      categoryId: 0,
      images: ['', '', ''],
    },
  })

  // Mutation for creating a new product
  const createMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: (data) => {
      // Invalidate products query and navigate to the new product page
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast.success('Product created successfully!')
      navigate({
        to: '/products/$productId',
        params: { productId: String(data.id) },
      })
    },
  })

  const onSubmit = (data: CreateProductFormData) => {
    // Filter out empty image URLs
    const filteredImages = data.images.filter((img) => img.trim() !== '')

    createMutation.mutate({
      ...data,
      images: filteredImages,
    })
  }

  const handleBack = () => {
    const filters = getFilters()
    navigate({
      to: '/',
      search: filters || undefined,
    })
  }
  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-10 flex-1">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Product
          </h1>
          <p className="text-gray-600">Add a new product to your catalog</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {createMutation.isError && (
              <ErrorMessage message="An error occurred while creating the product. Please try again." />
            )}

            <FormInput
              label="Title"
              id="title"
              type="text"
              {...register('title')}
              error={errors.title?.message}
              isLoading={createMutation.isPending}
              placeholder="Enter product title"
            />

            <FormInput
              label="Price"
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              isLoading={createMutation.isPending}
              placeholder="0.00"
            />

            <FormSelect
              label="Category"
              id="categoryId"
              {...register('categoryId', { valueAsNumber: true })}
              error={errors.categoryId?.message}
              isLoading={createMutation.isPending || isLoadingCategories}
              options={categories}
            />

            <FormTextArea
              label="Description"
              id="description"
              {...register('description')}
              error={errors.description?.message}
              isLoading={createMutation.isPending}
              rows={4}
              placeholder="Enter product description"
            />

            {/* Images Section */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Images
              </label>
              <div className="space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    <input
                      type="text"
                      {...register(`images.${index}`)}
                      disabled={createMutation.isPending}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.images && index === 0
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={`Image URL ${index + 1}${index === 0 ? ' (required)' : ' (optional)'}`}
                    />
                    {errors.images && index === 0 && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.images.root?.message}
                      </p>
                    )}
                  </div>
                ))}
                {errors.images?.message && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.images.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  You can add up to 3 images.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <SubmitButton isLoading={createMutation.isPending}>
                Create Product
              </SubmitButton>
              <button
                type="button"
                onClick={handleBack}
                disabled={createMutation.isPending}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
