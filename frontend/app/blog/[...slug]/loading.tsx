import PostLayoutAPI from '@/layouts/PostLayoutAPI'

export default function Loading() {
    return (
        <div className="animate-pulse">
            {/* Skeleton for Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4 mb-8"></div>
                <div className="flex gap-4 mb-12">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
            </div>

            {/* Skeleton for Content Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    {/* Left: TOC Skeleton */}
                    <div className="hidden lg:block w-[300px] shrink-0">
                        <div className="h-64 bg-white dark:bg-gray-900 rounded-3xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-800"></div>
                    </div>

                    {/* Right: Content Skeleton */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 min-h-[600px]">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full pt-8"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
