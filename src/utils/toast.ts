import { toast, type ToastOptions } from 'react-toastify'

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options)
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options)
  },
}