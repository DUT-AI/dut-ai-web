'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent } from './ui/card'

interface Member {
    id: number
    name: string
    email: string
    phone_number: string
    status: string
    role_id: number
    role_name: string
    avatar_url: string | null
    discord_id: string | null
}

type FilterRole = 'BCN' | 'Leader' | 'Teammate'

function getRoleFilter(roleName: string): FilterRole {
    if (roleName === 'admin') return 'BCN'
    if (roleName === 'leader') return 'Leader'
    return 'Teammate'
}

const DEFAULT_AVATAR = '/static/images/chiikawa.jpeg'

export default function OrganizationSystem() {
    const [activeRole, setActiveRole] = useState<FilterRole>('BCN')
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Ref để xử lý cuộn ngang bằng phím giữa/con trỏ chuột
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch('/api/members')
                if (!res.ok) throw new Error('Failed to fetch members')
                const data: Member[] = await res.json()
                // Chỉ hiển thị thành viên active
                setMembers(data.filter((m) => m.status === 'active'))
            } catch (err) {
                setError('Không thể tải danh sách thành viên.')
            } finally {
                setLoading(false)
            }
        }
        fetchMembers()
    }, [])

    // Logic tách biệt cuộn: Khi di chuột vào vùng này, lăn chuột chỉ cuộn ngang, không cuộn trang
    // Logic tách biệt cuộn: Khi di chuột vào vùng này, lăn chuột chỉ cuộn ngang, không cuộn trang
    // Sử dụng useEffect để add event listener non-passive, giúp preventDefault hoạt động tốt hơn
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            // Kiểm tra xem danh sách có đủ dài để cuộn ngang không
            // const isScrollable = container.scrollWidth > container.clientWidth

            // Luôn chặn cuộn dọc trang khi đang ở trong vùng này và chuyển thành cuộn ngang
            if (e.deltaY !== 0) {
                // Ngăn chặn hành vi mặc định (cuộn trang)
                e.preventDefault()
                // Chuyển lực cuộn dọc thành cuộn ngang, nhân 3 để nhanh hơn
                container.scrollLeft += e.deltaY * 3
            }
        }

        // Add event listener với passive: false để có thể gọi preventDefault
        container.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [members, activeRole]) // Re-run khi data thay đổi để đảm bảo ref đã có content

    const filteredMembers = members.filter(
        (m) => getRoleFilter(m.role_name) === activeRole
    )

    const getRoleLabel = (filter: FilterRole) => {
        if (filter === 'BCN') return 'Ban Chấp Hành'
        if (filter === 'Leader') return 'Trưởng ban'
        return 'Thành viên'
    }

    const getMemberRoleLabel = (roleName: string) => {
        if (roleName === 'admin') return 'Ban Chấp Hành'
        if (roleName === 'leader') return 'Leader'
        return 'Thành viên'
    }

    return (
        <div className="py-4">
            <h2 className="mb-6 text-2xl font-bold text-primary-900 dark:text-white">Hệ thống tổ chức</h2>

            {/* Bộ lọc vai trò */}
            <div className="flex flex-wrap gap-4 mb-8">
                {(['BCN', 'Leader', 'Teammate'] as FilterRole[]).map((role) => (
                    <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeRole === role
                                ? 'bg-rose-500 text-white shadow-md dark:bg-rose-600'
                                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {getRoleLabel(role)}
                    </button>
                ))}
            </div>

            {loading && (
                <p className="text-gray-500 dark:text-gray-400 animate-pulse">Đang tải thành viên...</p>
            )}

            {error && (
                <p className="text-red-500 font-medium">{error}</p>
            )}

            {!loading && !error && (
                <div
                    ref={scrollRef}
                    className="flex flex-row gap-6 overflow-x-auto pb-8 h-[300px] scrollbar-hide select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
                    style={{
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-x'
                    }}
                >
                    {filteredMembers.map((member) => (
                        <Card
                            key={member.id}
                            className="flex-shrink-0 w-[180px] h-[250px] flex flex-col items-center p-4 group hover:shadow-xl transition-all snap-start border border-primary-100 bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <CardContent className="flex flex-col items-center p-0 w-full justify-center h-full">
                                <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-2xl border-2 border-primary-100 transition-all shadow-sm dark:border-gray-700">
                                    <Image
                                        src={member.avatar_url || DEFAULT_AVATAR}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized={!!member.avatar_url}
                                    />
                                </div>
                                <h4 className="font-bold text-sm text-center uppercase leading-tight line-clamp-2 px-2 text-primary-900 dark:text-white">
                                    {member.name}
                                </h4>
                                <p className="text-[10px] uppercase tracking-widest text-center mt-3 font-bold text-rose-500 dark:text-rose-400">
                                    {getMemberRoleLabel(member.role_name)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}

                    {!loading && filteredMembers.length === 0 && (
                        <div className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <p className="text-gray-500 dark:text-gray-400">Không có thành viên trong nhóm này.</p>
                        </div>

                    )}
                </div>
            )}

            {/* CSS để ẩn thanh cuộn nhưng vẫn giữ tính năng cuộn mượt */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}