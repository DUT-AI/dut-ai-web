import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import NextImage from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex items-center w-full justify-between py-4 px-6 md:px-12 border-b border-primary-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center gap-2">
          <NextImage
            src={siteMetadata.siteLogo}
            alt={siteMetadata.headerTitle as string}
            width={48}
            height={48}
            className="h-12 w-12 rounded-md object-contain"
            priority
          />
          {typeof siteMetadata.headerTitle === 'string' ? (
            <span className="hidden text-lg font-bold tracking-tight text-primary-900 dark:text-white sm:block">
              {siteMetadata.headerTitle}
            </span>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-900 dark:hover:text-primary-200 m-1 font-semibold text-gray-600 dark:text-gray-300 text-sm transition-colors"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
