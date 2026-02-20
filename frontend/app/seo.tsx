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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({ title, description, image, keywords = [], ...rest }: PageSEOProps): Metadata {
  const allKeywords = [...BASE_KEYWORDS, ...keywords]

  return {
    title,
    description: description || siteMetadata.description,
    keywords: allKeywords,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
