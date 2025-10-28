import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { deleteProduct } from '@/api/products'
import { showToast } from '@/utils/toast'
import { useProductsFilters } from '@/hooks/useProductFilters'

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
  productName: string
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  productId,
  productName,
}: DeleteProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { getFilters } = useProductsFilters()

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      showToast.success('Product deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      handleClose()
      const savedFilters = getFilters()
      navigate({
        to: '/',
        search: savedFilters || undefined,
      })
    },
  })

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleteMutation.isPending) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, deleteMutation.isPending])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current === e.target && !deleteMutation.isPending) {
      handleClose()
    }
  }

  const handleClose = () => {
    deleteMutation.reset()
    onClose()
  }

  const handleConfirm = () => {
    deleteMutation.mutate(productId)
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn"
      data-testid="delete-product-modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg
            className="w-8 h-8 text-red-600"
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
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Delete Product?
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{productName}"</span>?
          This action cannot be undone.
        </p>

        {deleteMutation.isError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
            <svg
              className="w-5 h-5 mr-2 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Failed to delete product. Please try again.
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {deleteMutation.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
