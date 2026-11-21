'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import NextImage from 'next/image'
import Link from '@/components/common/Link'
import MobileNav from '@/components/layout/MobileNav'
import ThemeSwitch from '@/components/layout/ThemeSwitch'
import SearchButton from '@/components/common/SearchButton'
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
  const isAdminPage = pathname?.startsWith('/admin')
  const isEventsPage = pathname?.startsWith('/events')

  const isMembersPage = pathname?.startsWith('/members')

  if (isAdminPage || isMembersPage) {
    return null
  }

  // Only force white text when on events/about page, in dark mode, and not scrolled
  const forceWhite = isEventsPage && !scrolled && isDark

  let headerClass = `mx-auto flex items-center justify-between transition-all duration-300 z-50 ${
    scrolled
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

          {typeof siteMetadata.headerTitle === 'string' ? (
            <span
              className={`hidden text-[20px] font-black tracking-wide sm:block ${logoTextColor}`}
            >
              {siteMetadata.headerTitle}
            </span>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>

      {/* Centered Navigation */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-x-8 md:flex">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group relative py-2 text-[15px] font-medium transition-colors"
              >
                <span
                  className={
                    forceWhite
                      ? isActive
                        ? 'text-blue-300'
                        : 'text-white/90 hover:text-white'
                      : isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
                  }
                >
                  {link.title}
                </span>

                {/* Hover/Active Underline Animation */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'} `}
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
