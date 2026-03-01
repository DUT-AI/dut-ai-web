import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { getAuthorStats } from '@/lib/api'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default async function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content
  const stats = await getAuthorStats(name)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            )}
            <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            {stats && (
              <div className="mt-5 flex gap-6">
                <div className="flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-800 px-6 py-4 ring-1 ring-gray-100 dark:ring-gray-700">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {stats.total_views.toLocaleString('vi-VN')}
                  </span>
                  <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Lượt xem
                  </span>
                </div>
                <div className="flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-800 px-6 py-4 ring-1 ring-gray-100 dark:ring-gray-700">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {stats.post_count}
                  </span>
                  <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Bài viết
                  </span>
                </div>
              </div>
            )}
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
