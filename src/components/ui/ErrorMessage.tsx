interface ErrorAlertProps {
  headerMessage?: string
  message: string
}

export default function ErrorMessage({
  headerMessage,
  message,
}: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center space-x-3">
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <div className="min-h-7">
        {headerMessage && <p className="font-bold">{headerMessage}</p>}
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  )
}
