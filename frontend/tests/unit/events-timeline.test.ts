import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseImageUrls,
  parseEventDate,
  getUpcomingPublicEvent,
  buildPastEvents,
} from '../../features/events/db/timeline'
import type { PublicEvent, Post } from '../../features/events/db/types'

test('parseImageUrls extracts clean URLs from arrays, strings or JSON lists', () => {
  // Array of valid URLs
  const urls = parseImageUrls(['https://example.com/img1.jpg', 'https://example.com/img2.png'])
  assert.deepEqual(urls, ['https://example.com/img1.jpg', 'https://example.com/img2.png'])

  // String containing URLs
  const single = parseImageUrls('https://example.com/poster.jpg')
  assert.deepEqual(single, ['https://example.com/poster.jpg'])

  // Empty or invalid input
  assert.deepEqual(parseImageUrls(null), [])
  assert.deepEqual(parseImageUrls(undefined), [])
  assert.deepEqual(parseImageUrls(''), [])
})

test('parseEventDate attaches UTC+07 timezone to raw wall-clock timestamps', () => {
  const date = parseEventDate('2026-12-25 09:00:00')
  assert.ok(date instanceof Date)
  assert.equal(Number.isNaN(date?.getTime()), false)

  // Invalid date string
  assert.equal(parseEventDate('not-a-date'), null)
  assert.equal(parseEventDate(undefined), null)
})

test('getUpcomingPublicEvent selects nearest future event based on referenceTime', () => {
  const events: PublicEvent[] = [
    {
      id: 1,
      title: 'Past Workshop',
      events_date: '2026-01-10 14:00:00',
      description: 'Past',
      is_published: true,
    } as unknown as PublicEvent,
    {
      id: 2,
      title: 'Next Week Workshop',
      events_date: '2026-06-15 08:30:00',
      description: 'Upcoming',
      is_published: true,
    } as unknown as PublicEvent,
    {
      id: 3,
      title: 'Far Future Event',
      events_date: '2026-11-20 09:00:00',
      description: 'Future',
      is_published: true,
    } as unknown as PublicEvent,
  ]

  const upcoming = getUpcomingPublicEvent(events, '2026-06-01T00:00:00+07:00')
  assert.equal(upcoming?.id, 2, 'Should pick nearest future event #2')

  // When all events are in the past
  const noneUpcoming = getUpcomingPublicEvent(events, '2027-01-01T00:00:00+07:00')
  assert.equal(noneUpcoming, null)
})

test('buildPastEvents combines past public events and posts sorted descending by date', () => {
  const events: PublicEvent[] = [
    {
      id: 1,
      title: 'Past Public Event 1',
      events_date: '2026-02-01 10:00:00',
      description: 'Event 1',
    } as PublicEvent,
  ]

  const posts: Post[] = [
    {
      id: 10,
      title: 'Past Activity Post',
      events_date: '2026-03-01 15:00:00',
      description: 'Post 1',
    } as Post,
  ]

  const pastEvents = buildPastEvents(events, posts, '2026-05-01T00:00:00+07:00')
  assert.equal(pastEvents.length, 2)
  // Sorted descending: Post (March) before Event (February)
  assert.equal(pastEvents[0].id, 'post-10')
  assert.equal(pastEvents[1].id, 'pe-1')
})
