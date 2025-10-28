import { toast, type ToastOptions } from 'react-toastify'

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options) // używa ustawień z ToastContainer
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options)
  },
}