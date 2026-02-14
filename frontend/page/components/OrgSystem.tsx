'use client' // Đảm bảo có dòng này ở đầu file vì có dùng useState

import { useState } from 'react'
import Image from 'next/image'

const memberData = {
    BCN: [
        { name: 'Huỳnh Phước Nguyên', role: 'Chủ nhiệm', img: '/static/images/chiikawa.jpeg' },
        { name: 'Phạm Thị Thảo Nguyên', role: 'Phó chủ nhiệm', img: '/static/images/chiikawa.jpeg' },
        { name: 'Vương Ngọc Hậu', role: 'Phó chủ nhiệm', img: '/static/images/chiikawa.jpeg' },
    ],
    Leader: [
        { name: 'Biện Cao Cường', role: 'Leader team 1', img: '/static/images/chiikawa.jpeg' },
        { name: 'Trần Hữu Dũng', role: 'Leader team 2', img: '/static/images/chiikawa.jpeg' },
        { name: 'Lê Xuân Hòa', role: 'Leader team 3', img: '/static/images/chiikawa.jpeg' },
        { name: 'Trương Minh Hiển', role: 'Leader team 4', img: '/static/images/chiikawa.jpeg' },
    ],
    Teammate: [
        { name: 'Trương Bùi Diễn', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Lương Duy Toàn', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Trần Thị Hoài Như', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Trần Thị Tuyết Trinh', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Phan Tấn Sơn', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Trương Thị Ngọc Huyền', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Quế Đình Anh Tú', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Lương Duy Toàn', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Phan Vũ Long', role: 'Member', img: '/static/images/chiikawa.jpeg' },
        { name: 'Nguyễn Đỗ Khánh Linh', role: 'Member', img: '/static/images/chiikawa.jpeg' },
    ],
}

type RoleType = 'BCN' | 'Leader' | 'Teammate'

export default function OrganizationSystem() {
    const [activeRole, setActiveRole] = useState<RoleType>('BCN')

    return (
        <div className="py-10">
            <h2 className="text-2xl font-bold mb-6">Hệ thống tổ chức</h2>

            {/* Nút bấm chuyển đổi */}
            <div className="flex flex-wrap gap-4 mb-8">
                {(['BCN', 'Leader', 'Teammate'] as RoleType[]).map((role) => (
                    <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeRole === role
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        {role === 'BCN' ? 'Ban Chấp Hành' : role}
                    </button>
                ))}
            </div>

            {/* Danh sách thẻ thành viên */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {memberData[activeRole].map((member, index) => (
                    <div key={index} className="flex flex-col items-center group">
                        <div className="relative w-32 h-32 mb-3 overflow-hidden rounded-xl border-2 border-transparent group-hover:border-primary-500 transition-all">
                            <Image
                                src={member.img}
                                alt={member.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <h4 className="font-bold text-sm text-center text-gray-900 dark:text-gray-100 uppercase">
                            {member.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {member.role}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}