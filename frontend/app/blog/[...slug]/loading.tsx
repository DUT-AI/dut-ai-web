import PostLayoutAPI from '@/features/blog/components/PostLayoutAPI'

export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Skeleton for Header */}
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 h-12 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="mb-12 flex gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>

      {/* Skeleton for Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Left: TOC Skeleton */}
          <div className="hidden w-[300px] shrink-0 lg:block">
            <div className="h-64 rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"></div>
          </div>

          {/* Right: Content Skeleton */}
          <div className="flex-1">
            <div className="min-h-[600px] rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-100 sm:p-12 lg:p-16 dark:bg-gray-900 dark:ring-gray-800">
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-full rounded bg-gray-200 pt-8 dark:bg-gray-800"></div>
                <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
