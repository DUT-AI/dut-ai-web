import { Blog } from '../blogs/types'
import { PublicEvent, Post } from '../events/types'
import { Project } from '../projects/types'

export interface HomePageData {
  latest_blogs: Blog[]
  latest_events: PublicEvent[]
  latest_projects: Project[]
  latest_posts: Post[]
}
