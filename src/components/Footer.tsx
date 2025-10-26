export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm text-gray-500">
          © {currentYear} Fake Store. Built for recruitment purposes.
        </p>
      </div>
    </footer>
  )
}
