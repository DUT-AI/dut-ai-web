import { writeFileSync, mkdirSync } from 'fs'
import fs from 'fs'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { marked } from 'marked'
import dotenv from 'dotenv'

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' })
} else {
  dotenv.config()
}

const outputFolder = process.env.EXPORT ? 'out' : 'public'
const API_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:8002/api/v1'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    ${post.content && `<content:encoded><![CDATA[${post.content}]]></content:encoded>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, page = 'feed.xml') {
  try {
    const res = await fetch(`${API_URL}/blogs/`)
    if (!res.ok) {
      console.warn('Failed to fetch blogs for RSS generation', res.status)
      return
    }
    const apiBlogs = await res.json()
    
    const allBlogs = await Promise.all(apiBlogs.map(async (blog) => {
      let content = ''
      try {
        const detailRes = await fetch(`${API_URL}/blogs/${blog.id}`)
        if (detailRes.ok) {
          const detailBlog = await detailRes.json()
          if (detailBlog.content) {
            content = marked.parse(detailBlog.content)
          }
        }
      } catch (err) {
        console.warn(`Could not fetch detail for blog ${blog.id}:`, err.message)
      }

      return {
        slug: blog.slug || blog.id.toString(),
        date: blog.created_at,
        title: blog.title,
        summary: blog.summary || '',
        content: content,
        tags: blog.keywords ? blog.keywords.map(k => k.keyword_name) : []
      }
    }))

    const publishPosts = allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // RSS for blog post
    if (publishPosts.length > 0) {
      const rss = generateRss(config, publishPosts)
      writeFileSync(`./${outputFolder}/${page}`, rss)
      console.log('RSS feed generated...')
    }
  } catch (error) {
    console.error('Error generating RSS:', error)
  }
}

const rss = async () => {
  await generateRSS(siteMetadata)
}

export default rss
