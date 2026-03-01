
import ButtonLink from '@/components/ButtonLink'

export default function PortfolioSection() {
    return (
        <section className="px-6 py-16 md:px-12 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-16 text-center flex flex-col items-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:bg-gray-800 dark:border-blue-900/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Our Portfolio</span>
                </div>

                <h2 className="text-[48px] md:text-[72px] font-extrabold leading-[1] text-[#1E293B] dark:text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Next-Gen
                </h2>
                <h2 className="text-[48px] md:text-[72px] font-extrabold leading-[1.1] bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    AI Innovations
                </h2>

                <p className="mx-auto mt-6 max-w-[700px] text-[18px] md:text-[20px] font-medium leading-[1.4] text-[#475569] dark:text-gray-400">
                    Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người.<br className="hidden md:block" />
                    Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI.
                </p>
            </div>

            {/* Project cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                        num: '1',
                        tag: 'NLP',
                        title: 'DUT-AI Chatbot',
                        desc: 'Hệ thống chatbot thông minh hỗ trợ sinh viên giải đáp thắc mắc về lộ trình học tập và thủ tục hành chính.',
                        bg: 'bg-[#6A8F74]',
                    },
                    {
                        num: '1',
                        tag: 'NLP',
                        title: 'Speakee – AI Speaking Coach',
                        desc: 'Trợ lý luyện nói thông minh giúp bạn tự tin giao tiếp tiếng Anh mỗi ngày bằng việc luyện tập, nhận phản hồi tức thì và theo dõi tiến bộ cá nhân hóa bằng AI.',
                        bg: 'bg-[#6A8F74]',
                    },
                    {
                        num: '1',
                        tag: 'NLP',
                        title: 'Smart Rescue – Ứng dụng cứu hộ thông minh',
                        desc: 'Hệ thống cứu hộ khẩn cấp tích hợp định vị GPS thời gian thực, giúp kết nối người gặp sự cố với lực lượng hỗ trợ gần nhất và tối ưu hóa lộ trình di chuyển bằng thuật toán AI.',
                        bg: 'bg-[#6A8F74]',
                    },
                ].map((p, idx) => (
                    <div key={idx} className="group flex flex-col overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800 dark:ring-gray-700">
                        {/* Thumbnail */}
                        <div className={`relative flex h-[260px] w-full items-center justify-center rounded-[24px] ${p.bg} overflow-hidden`}>
                            <span className="text-[140px] font-normal leading-none text-white select-none translate-y-2">{p.num}</span>

                            {/* HOT RELEASE badge */}
                            <span className="absolute top-4 left-4 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-md">
                                Hot Release
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col p-4 pt-6">
                            <span className="mb-3 w-fit rounded-md bg-[#2563EB]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2563EB]">
                                {p.tag}
                            </span>
                            <h3 className="text-[24px] font-bold leading-[1.33] text-[#1E293B] dark:text-white">
                                {p.title}
                            </h3>
                            <p className="mt-3 text-[14px] leading-[1.625] text-[#475569] dark:text-gray-400">
                                {p.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <ButtonLink href="/projects" content="Xem tất cả dự án →" />
            </div>
        </section>
    )
}
