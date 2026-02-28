import Link from '@/components/Link'
import SparkleIcon from '@/components/SparkleIcon'


export default function CTASection() {
    return (
        <section className="relative w-full py-20 lg:py-32 px-6 md:px-12 flex justify-center">
            {/* Soft background blob for pink */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] rounded-full bg-pink-200/50 mix-blend-multiply filter blur-[100px] dark:bg-pink-900/20" />
                <div className="absolute top-[20%] right-[10%] w-[50%] h-[60%] rounded-full bg-blue-200/40 mix-blend-multiply filter blur-[100px] dark:bg-blue-900/20" />
            </div>

            <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-16 lg:gap-8 items-center">
                {/* Left Side */}
                <div className="flex flex-col gap-6 max-w-lg">
                    <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                            CONNECT WITH US
                        </p>
                        <h2 className="text-5xl sm:text-6xl lg:text-[70px] font-black uppercase leading-[1.05] text-[#1e293b] dark:text-white tracking-tighter">
                            READY<br />
                            TO<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5b94] to-[#60a5fa]">
                                EVOLVE?
                            </span>
                        </h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-sm text-sm sm:text-base">
                        Trở thành một phần của cộng đồng DUT AI Club và cùng chúng mình xây dựng tương lai từ hôm nay.
                    </p>

                    <div className="mt-4 flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-pink-100 dark:bg-gray-800 dark:border-gray-700 text-pink-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">EMAIL</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">dut.ai.clb@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-blue-100 dark:bg-gray-800 dark:border-gray-700 text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">LOCATION</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">54 Nguyen Luong Bang, Da Nang</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Cards */}
                <div className="w-full flex justify-center lg:justify-end pb-8 mt-12 lg:mt-0 relative">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-[500px]">
                        {/* Column 1 - Offset down */}
                        <div className="flex flex-col gap-4 sm:gap-6 pt-0 sm:pt-12">
                            {/* Bứt phá (Zap) */}
                            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-700/50 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-row items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
                                <div className="flex items-center justify-center p-2 rounded-full bg-blue-50 dark:bg-blue-900/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-white text-[15px] sm:text-[16px]">Bứt phá</span>
                            </div>

                            {/* Nỗ lực (Target) */}
                            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-700/50 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-row items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
                                <div className="flex items-center justify-center p-2 rounded-full bg-blue-50 dark:bg-blue-900/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <circle cx="12" cy="12" r="6"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                    </svg>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-white text-[15px] sm:text-[16px]">Nỗ lực</span>
                            </div>
                        </div>

                        {/* Column 2 - Normal position */}
                        <div className="flex flex-col gap-4 sm:gap-6 pb-0 sm:pb-12">
                            {/* Sáng tạo (Lightbulb) */}
                            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-700/50 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-row items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
                                <div className="flex items-center justify-center p-2 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-500">
                                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path>
                                        <path d="M9 18h6"></path>
                                        <path d="M10 22h4"></path>
                                    </svg>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-white text-[15px] sm:text-[16px]">Sáng tạo</span>
                            </div>

                            {/* Vươn xa (Globe) */}
                            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-700/50 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-row items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
                                <div className="flex items-center justify-center p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/40">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                </div>
                                <span className="font-bold text-[#0F172A] dark:text-white text-[15px] sm:text-[16px]">Vươn xa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
