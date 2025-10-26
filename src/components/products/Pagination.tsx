interface PaginationProps {
  currentPage: number
  hasMore: boolean
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  hasMore,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-4 pt-2.5 mt-auto">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
      >
        ← Previous
      </button>
      <span className="text-gray-700 font-medium">Page {currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
      >
        Next →
      </button>
    </div>
  )
}
