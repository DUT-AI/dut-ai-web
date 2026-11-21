import Link from '@/components/common/Link'
import SparkleIcon from '@/components/common/SparkleIcon'

export default function CTASection() {
  return (
    <section className="relative flex w-full justify-center px-6 md:px-12">
      {/* Soft background blob for pink */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
        <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[60%] rounded-full bg-pink-200/50 mix-blend-multiply blur-[100px] filter dark:bg-pink-900/20" />
        <div className="absolute top-[20%] right-[10%] h-[60%] w-[50%] rounded-full bg-blue-200/40 mix-blend-multiply blur-[100px] filter dark:bg-blue-900/20" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-16 md:grid-cols-2 lg:gap-8">
        {/* Left Side */}
        <div className="flex max-w-lg flex-col gap-6">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[0.25em] text-gray-500 uppercase dark:text-gray-400">
              CONNECT WITH US
            </p>
            <h2 className="text-5xl leading-[1.05] font-black tracking-tighter text-[#1e293b] uppercase sm:text-6xl lg:text-[70px] dark:text-white">
              READY
              <br />
              TO
              <br />
              <span className="bg-gradient-to-r from-[#ff5b94] to-[#60a5fa] bg-clip-text text-transparent">
                EVOLVE?
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed font-medium text-gray-600 sm:text-base dark:text-gray-300">
            Trở thành một phần của cộng đồng DUT AI Club và cùng chúng mình xây dựng tương lai từ
            hôm nay.
          </p>

          <div className="mt-4 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pink-100 bg-white/70 text-pink-500 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  EMAIL
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  dut.ai.clb@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-white/70 text-blue-500 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  LOCATION
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  54 Nguyen Luong Bang, Da Nang
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="relative mt-12 flex w-full justify-center pb-8 lg:mt-0 lg:justify-end">
          <div className="grid w-full max-w-[500px] grid-cols-2 gap-4 sm:gap-6">
            {/* Column 1 - Offset down */}
            <div className="flex flex-col gap-4 pt-0 sm:gap-6 sm:pt-12">
              {/* Bứt phá (Zap) */}
              <div className="flex flex-row items-center gap-4 rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center justify-center rounded-full bg-blue-50 p-2 dark:bg-blue-900/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <span className="text-[15px] font-bold text-[#0F172A] sm:text-[16px] dark:text-white">
                  Bứt phá
                </span>
              </div>

              {/* Nỗ lực (Target) */}
              <div className="flex flex-row items-center gap-4 rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center justify-center rounded-full bg-blue-50 p-2 dark:bg-blue-900/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <span className="text-[15px] font-bold text-[#0F172A] sm:text-[16px] dark:text-white">
                  Nỗ lực
                </span>
              </div>
            </div>

            {/* Column 2 - Normal position */}
            <div className="flex flex-col gap-4 pb-0 sm:gap-6 sm:pb-12">
              {/* Sáng tạo (Lightbulb) */}
              <div className="flex flex-row items-center gap-4 rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center justify-center rounded-full bg-fuchsia-50 p-2 dark:bg-fuchsia-900/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-fuchsia-500 sm:h-6 sm:w-6"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                </div>
                <span className="text-[15px] font-bold text-[#0F172A] sm:text-[16px] dark:text-white">
                  Sáng tạo
                </span>
              </div>

              {/* Vươn xa (Globe) */}
              <div className="flex flex-row items-center gap-4 rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center justify-center rounded-full bg-indigo-50 p-2 dark:bg-indigo-900/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-indigo-500 sm:h-6 sm:w-6"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <span className="text-[15px] font-bold text-[#0F172A] sm:text-[16px] dark:text-white">
                  Vươn xa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
