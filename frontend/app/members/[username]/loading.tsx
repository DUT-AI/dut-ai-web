export default function MemberPortfolioLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Skeleton */}
      <div className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800/60" />

      {/* About Skeleton */}
      <div className="mt-12 h-48 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />

      {/* Skills Skeleton */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        <div className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        <div className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
      </div>

      {/* Projects Skeleton */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        <div className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
        <div className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800/60" />
      </div>
    </div>
  )
}
