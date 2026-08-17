import { getBlogsQuery } from '../blogs/queries'
import { getPublicEventsQuery, getPostsQuery } from '../events/queries'
import { getProjectsQuery } from '../projects/queries'
import { HomePageData } from './types'

export async function getHomePageDataQuery(): Promise<HomePageData> {
  const [latest_blogs, latest_events, latest_projects, latest_posts] = await Promise.all([
    getBlogsQuery(),
    getPublicEventsQuery(),
    getProjectsQuery(),
    getPostsQuery(),
  ])

  return {
    latest_blogs: latest_blogs.slice(0, 5),
    latest_events: latest_events.slice(0, 5),
    latest_projects: latest_projects.slice(0, 6),
    latest_posts: latest_posts.slice(0, 6),
  }
}
