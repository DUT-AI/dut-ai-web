import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  absoluteTitle?: boolean
  description?: string
  image?: string
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
  absoluteTitle = false,
  description = siteMetadata.description,
  image = siteMetadata.socialBanner,
  path = '/',
  noIndex = false,
}: PageSEOProps): Metadata {
  const canonical = absoluteUrl(path)
  const socialImage = absoluteUrl(image)
  const openGraphImage =
    image === siteMetadata.socialBanner
      ? { url: socialImage, width: 1920, height: 1080, alt: title }
      : { url: socialImage, alt: title }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
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
      images: [socialImage],
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
