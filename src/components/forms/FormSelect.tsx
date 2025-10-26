import { forwardRef, type SelectHTMLAttributes } from 'react'
import FormErrorMessage from './FormErrorMessage'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  isLoading?: boolean
  options: Array<{ id: number; name: string }>
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, isLoading, options, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={isLoading}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${className}`}
            {...props}
          >
            <option value="">Select a category</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && <FormErrorMessage message={error} />}
      </div>
    )
  },
)

FormSelect.displayName = 'FormSelect'

export default FormSelect
