interface LoadingSpinnerProps {
  message: string
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center py-20 my-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
