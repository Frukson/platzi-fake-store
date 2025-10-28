import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProduct, updateProduct, getCategories } from '@/api/products'
import type { UpdateProductRequest } from '@/types/product.types'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import FormInput from '@/components/forms/FormInput'
import FormSelect from '@/components/forms/FormSelect'
import FormTextArea from '@/components/forms/FormTextArea'
import SubmitButton from '@/components/forms/SubmitButton'

import { z } from 'zod'
import { showToast } from '@/utils/toast'

export const updateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  price: z
    .number()
    .min(0, 'Price must be greater than 0')
    .max(1000000, 'Price is too high'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description is too long'),
  categoryId: z.number().min(1, 'Category is required'),
  images: z
    .array(z.string().url('Must be a valid URL'))
    .min(1, 'At least one image URL is required'),
})

export type UpdateProductFormData = z.infer<typeof updateProductSchema>

export const Route = createFileRoute('/products/$productId/edit/')({
  component: EditProductPage,
})

function EditProductPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(Number(productId)),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      categoryId: 1,
      images: [],
    },
  })

  useEffect(() => {
    if (product) {
      const formData = {
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: product.category.id,
        images: product.images,
      }
      reset(formData)
    }
  }, [product, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductRequest) =>
      updateProduct(Number(productId), data),
    onSuccess: async () => {
      const updatedProduct = await getProduct(Number(productId))
      queryClient.setQueryData(['product', productId], updatedProduct)
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast.success('Product updated successfully!')
      navigate({ to: '/products/$productId', params: { productId } })
    },
  })

  const onSubmit = (data: UpdateProductFormData) => {
    updateMutation.mutate(data)
  }

  if (isLoadingProduct) {
    return <LoadingSpinner message="Loading product for editing..." />
  }

  if (!product) {
    return <ErrorMessage headerMessage="Product not found" message={''} />
  }

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 flex-1">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Product
          </h1>
          <p className="text-gray-600">Update your product information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {updateMutation.isError && (
              <ErrorMessage
                headerMessage=""
                message="Failed to update product. Please try again."
              />
            )}

            <FormInput
              label="Title"
              id="title"
              type="text"
              {...register('title')}
              error={errors.title?.message}
              isLoading={updateMutation.isPending}
              placeholder="Product title"
            />

            <FormInput
              label="Price"
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              isLoading={updateMutation.isPending}
              placeholder="0.00"
            />

            <FormSelect
              label="Category"
              id="categoryId"
              {...register('categoryId', { valueAsNumber: true })}
              error={errors.categoryId?.message}
              isLoading={updateMutation.isPending}
              options={categories}
            />

            <FormTextArea
              label="Description"
              id="description"
              {...register('description')}
              error={errors.description?.message}
              isLoading={updateMutation.isPending}
              rows={4}
              placeholder="Product description"
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
                {product.images.map((_, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      {...register(`images.${index}`)}
                      disabled={updateMutation.isPending}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.images?.[index]
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={`Image URL ${index + 1}`}
                    />
                    {errors.images?.[index] && (
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
                        {errors.images[index]?.message}
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
                  {product.images.length === 1
                    ? 'This product has 1 image.'
                    : `This product has ${product.images.length} images.`}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <SubmitButton isLoading={updateMutation.isPending}>
                Save Changes
              </SubmitButton>
              <button
                type="button"
                onClick={() => router.history.back()}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all"
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
