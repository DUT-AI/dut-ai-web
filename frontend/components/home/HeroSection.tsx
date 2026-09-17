import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import Image from 'next/image'
import StatCounter from '@/components/home/StatCounter'

const Mascot = () => {
  return (
    <div className="relative z-10 flex w-[364px] items-center justify-center sm:w-[494px] lg:w-[546px]">
      <Image
        src="/static/images/linh_vat_tach_nen.png"
        alt="DUT AI Mascot"
        width={450}
        height={450}
        className="h-auto w-full transform object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
        priority
      />
    </div>
  )
}
export default function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl pt-40">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#BFDBFE] opacity-40 blur-[120px] dark:opacity-10" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-[#FCE7F3] opacity-40 blur-[120px] dark:opacity-10" />

      <div className="relative z-10 px-6 md:px-12">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:justify-between">
          {/* ── Left: Text content ── */}
          <div className="flex w-full flex-col items-center text-center lg:w-[55%] lg:items-start lg:text-left">
            {/* Badge tags */}
            <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold tracking-[0.05em] text-[#191970] uppercase shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                AI Learners
              </span>
              <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold tracking-[0.05em] text-[#191970] uppercase shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                EDUCATION
              </span>
              <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold tracking-[0.05em] text-[#191970] uppercase shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                INNOVATION
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl leading-[1.33] tracking-[-0.026em] whitespace-nowrap text-[#191970] drop-shadow-sm sm:text-6xl lg:text-[90px] dark:text-white">
              <span className="block">Câu lạc bộ</span>
              <span className="block">Trí tuệ nhân tạo</span>
              <span className="block">DUT</span>
            </h1>

            <div className="mt-8 ml-2 max-w-lg border-l-2 border-[#191970]/10 pl-6 text-left lg:ml-0 dark:border-gray-600">
              <p className="text-[20px] leading-[1.4] font-light text-[#191970]/70 dark:text-gray-300">
                Khám phá thế giới AI cùng cộng đồng DUT.AI. Nơi niềm đam mê công nghệ được chắp cánh
                bằng thực tiễn và tinh thần đồng đội.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#191970] px-8 py-4 text-[14px] font-bold tracking-wide text-white uppercase shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-white dark:text-[#191970]"
              >
                PROJECTS
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </Link>
              <Link
                href="#roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/80 bg-white/45 px-8 py-4 text-[14px] font-bold tracking-wide text-[#191970] uppercase shadow-[0_8px_32px_rgba(31,38,135,0.08)] backdrop-blur-[12px] transition-all hover:-translate-y-1 hover:bg-white/60 dark:border-gray-600 dark:bg-gray-800/45 dark:text-white"
              >
                ROADMAP
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zM9 11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Right: Mascot Illustration ── */}
          <div className="relative mt-10 flex w-full justify-center py-10 lg:mt-0 lg:w-[45%]">
            {/* Decorative icons */}
            <div className="absolute top-[-10%] right-[100%] flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md sm:right-[85%] dark:bg-gray-800/80">
              <SparkleIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="absolute right-[5%] bottom-[-15%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md sm:right-[0%] dark:bg-gray-800/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-6 w-6 text-[#191970]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.18.208l1.282 5.36a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L4.982 20.54a.562.562 0 01-.84-.61l1.282-5.36a.563.563 0 00-.164-.53l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>

            {/* Mascot */}
            <Mascot />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="mx-auto mt-20 flex w-full max-w-[1000px] flex-col items-center justify-between gap-10 md:mt-32 md:flex-row">
          <StatCounter target={25} suffix="+" label="Members" delay={0} />
          <StatCounter target={10} suffix="+" label="Projects" delay={200} />
          <StatCounter target={5} suffix="+" label="Events" delay={400} />
        </div>
      </div>
    </section>
  )
}
