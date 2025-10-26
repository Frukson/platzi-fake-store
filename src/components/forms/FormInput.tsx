import { forwardRef, type InputHTMLAttributes } from 'react'
import FormErrorMessage from './FormErrorMessage'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isLoading?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, isLoading, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <input
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

FormInput.displayName = 'FormInput'

export default FormInput
