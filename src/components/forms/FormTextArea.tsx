import { forwardRef, type TextareaHTMLAttributes } from 'react'
import FormErrorMessage from './FormErrorMessage'

interface FormTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  isLoading?: boolean
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, isLoading, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <FormErrorMessage message={error} />}
      </div>
    )
  },
)

FormTextArea.displayName = 'FormTextArea'

export default FormTextArea
