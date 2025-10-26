import { Link } from '@tanstack/react-router'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
      <h1 className="text-5xl font-bold text-purple-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
      >
        Back to products page
      </Link>
    </div>
  )
}
