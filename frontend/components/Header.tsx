import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import NextImage from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'mx-auto w-[calc(100%-2rem)] max-w-[1400px] mt-4 sm:mt-6 flex items-center justify-between py-2.5 px-3 sm:px-6 rounded-full border border-gray-200/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm transition-all'

  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-4 sm:top-6 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[30px] bg-white rounded-[6px] flex items-center justify-center overflow-hidden">
            <NextImage
              src={siteMetadata.siteLogo}
              alt={siteMetadata.headerTitle as string}
              width={40}
              height={30}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {typeof siteMetadata.headerTitle === 'string' ? (
            <span className="hidden text-[20px] font-black tracking-wide text-[#0F172A] dark:text-white sm:block">
              {siteMetadata.headerTitle}
            </span>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>

      {/* Centered Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-x-8">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="font-medium text-[#64748B] hover:text-[#1C1F3B] dark:text-gray-300 dark:hover:text-white text-[15px] transition-colors"
            >
              {link.title}
            </Link>
          ))}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <ThemeSwitch />
        <SearchButton />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
