import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'
import { Alfa_Slab_One } from 'next/font/google'

const alfaSlabOne = Alfa_Slab_One({
    weight: '400',
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
})

const Robot = () => {
    return (
        <div className="relative flex flex-col items-center z-10 w-[260px] sm:w-[320px]">
            {/* The neck/stand */}
            <div className="absolute -bottom-24 w-[200px] sm:w-[240px] h-[180px] rounded-b-[70px] bg-[#f8f9fa] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 z-0"></div>

            {/* The head */}
            <div className="relative z-10 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-[70px] bg-white shadow-[0_30px_80px_-15px_rgb(0,0,0,0.15)] ring-1 ring-black/5 flex items-center justify-center p-8 dark:bg-gray-800 dark:ring-white/10">
                {/* Screen */}
                <div className="w-full h-full rounded-[45px] bg-[#191970] flex flex-col items-center justify-center pt-8 border-[12px] border-[#f0f2f5] shadow-inner dark:border-gray-700">
                    {/* Eyes container */}
                    <div className="flex gap-10 w-full justify-center">
                        {/* Left Eye */}
                        <div className="w-[35px] h-[50px] sm:w-[45px] sm:h-[65px] rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse"></div>
                        {/* Right Eye */}
                        <div className="w-[35px] h-[50px] sm:w-[45px] sm:h-[65px] rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    {/* Mouth */}
                    <div className="w-[70px] sm:w-[90px] h-[8px] sm:h-[10px] rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] mt-12 opacity-90"></div>
                </div>
            </div>
        </div>
    )
}
export default function HeroSection() {
    return (
        <section className="relative py-16 md:py-24 md:pt-40 max-w-7xl mx-auto">
            {/* Background blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#BFDBFE] opacity-40 blur-[120px] dark:opacity-10" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-[#FCE7F3] opacity-40 blur-[120px] dark:opacity-10" />

            <div className="relative z-10 px-6 md:px-12">
                <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:justify-between">
                    {/* ── Left: Text content ── */}
                    <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
                        {/* Badge tags */}
                        <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                            <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.05em] text-[#191970] shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                                AI Learners
                            </span>
                            <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.05em] text-[#191970] shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                                2025 EDITION
                            </span>
                            <span className="rounded-full bg-white/50 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.05em] text-[#191970] shadow-sm ring-1 ring-white/90 backdrop-blur-[10px] dark:bg-gray-800/50 dark:text-white dark:ring-white/20">
                                INNOVATION
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className={`text-5xl sm:text-6xl lg:text-[90px] leading-[1.33] tracking-[-0.026em] text-[#191970] dark:text-white drop-shadow-sm ${alfaSlabOne.className}`}>
                            Câu lạc bộ Trí tuệ nhân tạo DUT
                        </h1>

                        <div className="mt-8 border-l-2 border-[#191970]/10 pl-6 ml-2 lg:ml-0 dark:border-gray-600 max-w-lg text-left">
                            <p className="text-[20px] leading-[1.4] text-[#191970]/70 font-light dark:text-gray-300">
                                Khám phá thế giới AI cùng cộng đồng DUT.AI. Nơi niềm
                                đam mê công nghệ được chắp cánh bằng thực tiễn và
                                tinh thần đồng đội.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                            <Link
                                href="/projects"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#191970] px-8 py-4 text-[14px] font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-white dark:text-[#191970]"
                            >
                                PROJECTS
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                </svg>
                            </Link>
                            <Link
                                href="#roadmap"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/45 border-2 border-white/80 px-8 py-4 text-[14px] font-bold uppercase tracking-wide text-[#191970] shadow-[0_8px_32px_rgba(31,38,135,0.08)] backdrop-blur-[12px] transition-all hover:-translate-y-1 hover:bg-white/60 dark:bg-gray-800/45 dark:border-gray-600 dark:text-white"
                            >
                                ROADMAP
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                                    <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zM9 11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: Robot Illustration ── */}
                    <div className="w-full lg:w-[45%] relative flex justify-center py-10 mt-10 lg:mt-0">
                        {/* Decorative icons */}
                        <div className="absolute top-[-10%] right-[100%] sm:right-[85%] flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md">
                            <SparkleIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="absolute bottom-[-15%] right-[5%] sm:right-[0%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-[#191970]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.18.208l1.282 5.36a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L4.982 20.54a.562.562 0 01-.84-.61l1.282-5.36a.563.563 0 00-.164-.53l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </div>

                        {/* Robot Construct */}
                        <Robot />

                    </div>
                </div>

                {/* ── Stats row ── */}
                <div className="mt-20 md:mt-32 w-full max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <h3 className="text-[36px] sm:text-[44px] lg:text-[50px] font-bold text-[#DF7DC8] tracking-[0.012em] whitespace-nowrap">
                        25+ Members
                    </h3>
                    <h3 className="text-[36px] sm:text-[44px] lg:text-[50px] font-bold text-[#DF7DC8] tracking-[0.012em] whitespace-nowrap">
                        10+ Projects
                    </h3>
                    <h3 className="text-[36px] sm:text-[44px] lg:text-[50px] font-bold text-[#DF7DC8] tracking-[0.012em] whitespace-nowrap">
                        5+ Events
                    </h3>
                </div>
            </div>
        </section>
    )
}
