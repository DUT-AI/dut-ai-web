import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '../.env' })

import { db } from '../lib/db'
import {
  getProjectsQuery,
  getGenerationAlbumsQuery,
  getIntroductionsQuery,
  getPublicEventsQuery,
  getPostsQuery,
  getBlogsQuery,
  getBlogKeywordsQuery,
} from '../lib/db/queries'

async function testDatabase() {
  console.log('🔄 Testing Drizzle ORM Database Connection...')

  try {
    const projects = await getProjectsQuery()
    console.log(`✅ Projects fetched: ${projects.length} item(s)`)

    const generations = await getGenerationAlbumsQuery({ publishedOnly: false })
    console.log(`✅ Generation albums fetched: ${generations.length} item(s)`)

    const intros = await getIntroductionsQuery()
    console.log(`✅ Introductions fetched: ${intros.length} item(s)`)

    const events = await getPublicEventsQuery()
    console.log(`✅ Public Events fetched: ${events.length} item(s)`)

    const posts = await getPostsQuery()
    console.log(`✅ Posts fetched: ${posts.length} item(s)`)

    const blogs = await getBlogsQuery()
    console.log(`✅ Blogs fetched: ${blogs.length} item(s)`)

    const keywords = await getBlogKeywordsQuery()
    console.log(`✅ Keywords fetched: ${keywords.length} item(s)`)

    console.log('\n🎉 ALL DATABASE QUERIES VIA DRIZZLE ORM EXECUTED SUCCESSFULLY!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection/query failed:', error)
    process.exit(1)
  }
}

testDatabase()
