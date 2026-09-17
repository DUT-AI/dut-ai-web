import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

// Global base keywords for all pages
export const BASE_KEYWORDS = [
  'DUT AI Club',
  'Câu lạc bộ AI',
  'Trí tuệ nhân tạo Đà Nẵng',
  'AI Đà Nẵng',
  'Đại học Bách khoa Đà Nẵng',
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'NLP',
  'sinh viên AI',
]

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  keywords?: string[]
  path?: string
  noIndex?: boolean
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteMetadata.siteUrl}/`).toString()
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function genPageMetadata({
  title,
  description = siteMetadata.description,
  image = siteMetadata.socialBanner,
  keywords = [],
  path = '/',
  noIndex = false,
}: PageSEOProps): Metadata {
  const canonical = absoluteUrl(path)
  const allKeywords = Array.from(new Set([...BASE_KEYWORDS, ...keywords]))
  const openGraphImage =
    image === siteMetadata.socialBanner
      ? { url: image, width: 1920, height: 1080, alt: title }
      : { url: image, alt: title }

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteMetadata.title,
      images: [openGraphImage],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
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
  }
}
