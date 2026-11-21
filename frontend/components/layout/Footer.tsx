import Link from '@/components/common/Link'
import siteMetadata from '@/data/siteMetadata'
import NextImage from 'next/image'

export default function Footer() {
  return (
    <footer className="relative z-10 flex w-full justify-center px-6 pt-20 pb-10 md:px-12">
      <div className="relative flex w-full max-w-[1000px] flex-col justify-between gap-12 rounded-[3rem] border border-white/50 bg-white/30 p-10 shadow-lg shadow-black/5 backdrop-blur-md transition-all md:flex-row md:p-14 dark:border-white/10 dark:bg-black/30">
        {/* Left Section */}
        <div className="flex max-w-md flex-col gap-8">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center gap-4">
                <div className="flex h-[30px] w-[40px] items-center justify-center overflow-hidden rounded-[6px] bg-white">
                  <NextImage
                    src={siteMetadata.siteLogo}
                    alt={siteMetadata.headerTitle as string}
                    width={40}
                    height={30}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                <span className="font-sans text-2xl font-black tracking-tighter text-gray-900 uppercase dark:text-white">
                  {siteMetadata.headerTitle}
                </span>
              </div>
            </Link>
          </div>

          <div className="space-y-4">
            <p className="text-sm leading-relaxed font-medium text-gray-900 dark:text-white">
              Câu lạc bộ trí tuệ nhân tạo DUT
              <br />
              Trường Đại học Bách Khoa - Đại học Đà Nẵng.
            </p>
            <p className="text-sm font-medium text-blue-500">
              Nơi khởi nguồn đam mê, kiến tạo tương lai.
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/50 text-orange-400 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                dut.ai.clb@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/50 text-gray-400 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                54 Nguyen Luong Bang, Đà Nẵng
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/50 text-blue-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54V12h2.54V9.79c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.94h-2.33v7C18.34 21.19 22 17.04 22 12.06c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </div>
              <Link
                href="https://www.facebook.com/dut.aiclub"
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 text-xs font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                DUT AI - Câu lạc bộ Trí tuệ nhân tạo DUT
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6 md:min-w-[120px]">
          <h4 className="text-[11px] font-black tracking-widest text-gray-900 uppercase dark:text-white">
            NAVIGATION
          </h4>
          <nav className="flex flex-col gap-3">
            <Link
              href="/about"
              className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              About Us
            </Link>
            <Link
              href="/projects"
              className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              Projects
            </Link>
            <Link
              href="/events"
              className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              Events
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              Blogs
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
