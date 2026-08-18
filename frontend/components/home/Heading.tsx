import SparkleIcon from "@/components/SparkleIcon"

export default function Heading({
    heading,
    subHeading,
    description,
    badge,
    isSubHeadingEnter
}: {
    heading: string
    subHeading: string
    description: string
    badge: string
    isSubHeadingEnter?: boolean
}) {
    return <div className="mb-16 text-center flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-2">
            <SparkleIcon className="w-6 h-6 text-blue-500" />
            <span className="text-[14px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                {badge}
            </span>
        </div>

        <h2 className="text-[48px] md:text-[72px] font-extrabold leading-[1] text-[#1E293B] dark:text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            {heading}
            {isSubHeadingEnter ? <br /> : " "}
            <span className="text-[48px] md:text-[72px] font-extrabold leading-[1.1] bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                {subHeading}
            </span>
        </h2>


        <p className="mx-auto mt-6 max-w-[800px] text-[18px] md:text-[20px] font-medium leading-[1.4] text-[#475569] dark:text-gray-400">
            {description}
        </p>
    </div>
}