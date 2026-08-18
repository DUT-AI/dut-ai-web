import { unstable_cache } from 'next/cache'
import * as rawQueries from './queries'

// ── Cached Query Wrappers with Next.js Cache & Revalidation Tags ──────────

export const getProjectsCached = unstable_cache(
  async () => rawQueries.getProjectsQuery(),
  ['cached-projects'],
  { revalidate: 600, tags: ['projects'] }
)

export const getProjectByIdCached = (id: number) =>
  unstable_cache(
    async () => rawQueries.getProjectByIdQuery(id),
    [`cached-project-${id}`],
    { revalidate: 600, tags: ['projects', `project-${id}`] }
  )()

export const getIntroductionsCached = unstable_cache(
  async () => rawQueries.getIntroductionsQuery(),
  ['cached-introductions'],
  { revalidate: 600, tags: ['introductions'] }
)

export const getMembersCached = unstable_cache(
  async () => rawQueries.getMembersQuery(),
  ['cached-members'],
  { revalidate: 300, tags: ['members', 'users'] }
)

export const getPublicEventsCached = unstable_cache(
  async () => rawQueries.getPublicEventsQuery(),
  ['cached-public-events'],
  { revalidate: 300, tags: ['events', 'public-events'] }
)

export const getPostsCached = unstable_cache(
  async () => rawQueries.getPostsQuery(),
  ['cached-posts'],
  { revalidate: 300, tags: ['events', 'posts'] }
)

export const getBlogsCached = (params?: { title?: string; keyword?: string }) =>
  unstable_cache(
    async () => rawQueries.getBlogsQuery(params),
    [`cached-blogs-${params?.title ?? ''}-${params?.keyword ?? ''}`],
    { revalidate: 300, tags: ['blogs'] }
  )()

export const getBlogBySlugCached = (slug: string) =>
  unstable_cache(
    async () => rawQueries.getBlogBySlugQuery(slug),
    [`cached-blog-slug-${slug}`],
    { revalidate: 60, tags: ['blogs', `blog-${slug}`] }
  )()

export const getFeaturedBlogsCached = (limit = 5) =>
  unstable_cache(
    async () => rawQueries.getFeaturedBlogsQuery(limit),
    [`cached-featured-blogs-${limit}`],
    { revalidate: 300, tags: ['blogs'] }
  )()

export const getTopAuthorsCached = (limit = 50) =>
  unstable_cache(
    async () => rawQueries.getTopAuthorsQuery(limit),
    [`cached-top-authors-${limit}`],
    { revalidate: 300, tags: ['blogs', 'authors'] }
  )()

export const getBlogKeywordsCached = unstable_cache(
  async () => rawQueries.getBlogKeywordsQuery(),
  ['cached-blog-keywords'],
  { revalidate: 600, tags: ['keywords', 'blogs'] }
)

export const getHomePageDataCached = unstable_cache(
  async () => rawQueries.getHomePageDataQuery(),
  ['cached-homepage-data'],
  { revalidate: 300, tags: ['homepage', 'blogs', 'projects', 'events', 'posts'] }
)
