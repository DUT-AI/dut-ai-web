import '@/css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { absoluteUrl, serializeJsonLd } from './seo'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter-var',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-jakarta-var',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: '/',
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1920,
        height: 1080,
        alt: 'DUT AI Club',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  verification: {
    google: siteMetadata.googleSiteVerification,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteMetadata.siteUrl}/#organization`,
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl(siteMetadata.siteLogo),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteMetadata.siteUrl}/#website`,
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        description: siteMetadata.description,
        inLanguage: 'vi-VN',
        publisher: { '@id': `${siteMetadata.siteUrl}/#organization` },
      },
    ],
  }

  return (
    <html
      lang={siteMetadata.language}
      className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="apple-mobile-web-app-title" content="DUT AI" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <body
        className="bg-[#F5F9FD] pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        <NextTopLoader
          color="linear-gradient(to right, #A2D2FF, #FFC2D1)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #A2D2FF,0 0 5px #FFC2D1"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <Header />
            <main className="mb-auto">{children}</main>
          </SearchProvider>
          {/* <Footer /> */}
        </ThemeProviders>
      </body>
    </html>
  )
}
