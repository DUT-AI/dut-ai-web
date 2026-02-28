'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import NextImage from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDark = resolvedTheme === 'dark'
  const isEventsPage = pathname?.startsWith('/events')
  // Only force white text when on events/about page, in dark mode, and not scrolled
  const forceWhite = (isEventsPage) && !scrolled && isDark

  let headerClass = `mx-auto flex items-center justify-between transition-all duration-300 z-50 ${scrolled
    ? 'w-full max-w-full py-3 px-4 sm:px-8 bg-white/75 dark:bg-gray-950/75 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/10 shadow-sm rounded-none'
    : 'w-[calc(100%-2rem)] max-w-[1400px] mt-4 sm:mt-6 py-2.5 px-3 sm:px-6 bg-transparent border border-transparent rounded-full'
    }`

  if (siteMetadata.stickyNav) {
    headerClass += scrolled ? ' fixed top-0 left-0 right-0' : ' absolute top-0 left-0 right-0'
  }

  // Determine text colors based on forceWhite state
  const logoTextColor = forceWhite ? 'text-white' : 'text-[#0F172A] dark:text-white'
  const iconGroupColor = forceWhite ? 'text-white' : 'text-gray-900 dark:text-gray-100'

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
            <span className={`hidden text-[20px] font-black tracking-wide sm:block ${logoTextColor}`}>
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
          .map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
            return (
              <Link
                key={link.title}
                href={link.href}
                className="relative group font-medium text-[15px] transition-colors py-2"
              >
                <span className={
                  forceWhite
                    ? isActive ? 'text-blue-300' : 'text-white/90 hover:text-white'
                    : isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
                }>
                  {link.title}
                </span>

                {/* Hover/Active Underline Animation */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 rounded-full
                    ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}
                  `}
                />
              </Link>
            )
          })}
      </div>

      <div className={`flex items-center space-x-2 sm:space-x-3 ${iconGroupColor}`}>
        <ThemeSwitch />
        <SearchButton />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
