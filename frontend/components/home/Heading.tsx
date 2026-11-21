import SparkleIcon from '@/components/common/SparkleIcon'

export default function Heading({
  heading,
  subHeading,
  description,
  badge,
  isSubHeadingEnter,
}: {
  heading: string
  subHeading: string
  description: string
  badge: string
  isSubHeadingEnter?: boolean
}) {
  return (
    <div className="mb-16 flex flex-col items-center text-center">
      <div className="mb-4 inline-flex items-center gap-2">
        <SparkleIcon className="h-6 w-6 text-blue-500" />
        <span className="text-[14px] font-bold tracking-[0.25em] text-gray-500 uppercase dark:text-gray-400">
          {badge}
        </span>
      </div>

      <h2 className="text-[48px] leading-[1] font-extrabold text-[#1E293B] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] md:text-[72px] dark:text-white">
        {heading}
        {isSubHeadingEnter ? <br /> : ' '}
        <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-400 bg-clip-text text-[48px] leading-[1.1] font-extrabold text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] md:text-[72px]">
          {subHeading}
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-[800px] text-[18px] leading-[1.4] font-medium text-[#475569] md:text-[20px] dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}
