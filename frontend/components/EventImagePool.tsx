'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

export default function EventImagePool({ posts }: { posts: CoreContent<Blog>[] }) {
    const [displayImages, setDisplayImages] = useState<string[]>([])

    useEffect(() => {
        // 1. Lọc ra các bài viết là SỰ KIỆN, sắp xếp theo ngày mới nhất, lấy 5 bài
        const eventPosts = posts
            .filter((post) => post.tags && post.tags.includes('event'))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)

        // 2. Gom ảnh từ pool đã lọc
        const pool: string[] = []
        eventPosts.forEach((post) => {
            // Handle images field - could be array of strings or single string
            if (post.images) {
                if (Array.isArray(post.images)) {
                    // Filter out invalid entries
                    const validImages = post.images.filter(img => typeof img === 'string' && img.trim() !== '')
                    pool.push(...validImages)
                } else if (typeof post.images === 'string') {
                    pool.push(post.images)
                }
            }
        })

        // 3. Trộn và lấy tối đa 10 ảnh
        if (pool.length > 0) {
            const shuffled = pool
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.min(10, pool.length))

            setDisplayImages(shuffled)
        } else {
            setDisplayImages([])
        }
    }, [posts])

    if (displayImages.length === 0) return null

    return (
        <div className="py-10">
            <h2 className="text-2xl font-bold mb-6">Khoảnh khắc DUT AI</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {displayImages.map((img, index) => (
                    <div key={index} className="relative h-40 overflow-hidden rounded-lg shadow-sm group">
                        <Image
                            src={img}
                            alt={`DUT AI Event ${index}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 italic text-right">
                * Hình ảnh được hiển thị ngẫu nhiên từ các sự kiện gần nhất
            </p>
        </div>
    )
}