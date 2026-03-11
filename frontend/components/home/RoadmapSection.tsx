import Heading from "./Heading";

export default function RoadmapSection() {
    return (
        <section id="roadmap" className="px-6 md:px-12 max-w-[1200px] mx-auto">
            {/* Header */}
            <Heading heading="ROADMAP TO" subHeading="AI ENGINEER" description="Lộ trình học tập và phát triển bản thân tại DUT AI." badge="ROADMAP" isSubHeadingEnter={true} />

            <div className="relative flex flex-col gap-16 md:pl-8">
                {/* Phase 01 */}
                <div className="relative z-10 w-full">
                    {/* Glowing Timeline Vertical Line */}
                    <div className="absolute left-[10px] top-[40px] bottom-[-40px] w-[4px] bg-linear-to-b from-[#8FA8F3] via-[#DBEAFE] to-transparent shadow-[0_0_12px_#3B82F6] rounded-full hidden md:block opacity-60 -z-10" />

                    {/* Phase Header */}
                    <div className="mb-8 flex items-center gap-6 relative md:-left-[26px]">
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-3xl dark:bg-gray-800 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                            🎓
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#2563EB] mb-1">Phase 01</p>
                            <h3 className="text-[32px] md:text-[40px] font-extrabold leading-[1.1] text-[#1E293B] dark:text-white">Học tập cùng Mentor</h3>
                        </div>
                    </div>

                    {/* Phase 01 Cards Container */}
                    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 pl-0 md:pl-10">
                        {[
                            { icon: '🖥️', title: 'Python cơ bản', desc: 'Xây dựng nền tảng lập trình vững chắc với ngôn ngữ phổ biến nhất trong AI.', time: 'Tháng 1-2', timeColor: 'text-[#2563EB]', bg: 'bg-[#EFF6FF] dark:bg-blue-700/50' },
                            { icon: '∑', title: 'Toán cho AI', desc: 'Đại số tuyến tính, giải tích và tối ưu hóa – ngôn ngữ của trí tuệ nhân tạo.', time: 'Tháng 2-3', timeColor: 'text-[#EC4899]', bg: 'bg-[#FFE4E6] dark:bg-pink-700/50' },
                            { icon: '📊', title: 'Thống kê & ML', desc: 'Từ các thuật toán cổ điển đến các mô hình dự đoán hiện đại nhất.', time: 'Tháng 3-4', timeColor: 'text-[#8B5CF6]', bg: 'bg-[#F3E8FF] dark:bg-purple-700/50' },
                            { icon: '🧠', title: 'Deep Learning', desc: 'Mạng nơ-ron sâu và các kiến trúc Transformer đột phá.', time: 'Tháng 4-5', timeColor: 'text-[#0D9488]', bg: 'bg-[#CCFBF1] dark:bg-teal-700/50' },
                            { icon: '👁️', title: 'Computer Vision', desc: 'Xử lý hình ảnh, nhận diện vật thể và phân đoạn ngữ nghĩa.', time: 'Tháng 5-6', timeColor: 'text-[#A855F7]', bg: 'bg-[#F3E8FF] dark:bg-purple-700/50' },
                            { icon: '💬', title: 'NLP & Generative AI', desc: 'Xử lý ngôn ngữ tự nhiên và kỷ nguyên của Generative AI.', time: 'Tháng 6-7', timeColor: 'text-[#F97316]', bg: 'bg-[#FFEDD5] dark:bg-orange-700/50' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col rounded-[32px] bg-white dark:bg-gray-800 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-[16px] ${item.bg} text-2xl`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-[20px] font-bold text-[#1E293B] dark:text-white mb-2">{item.title}</h4>
                                <p className="text-[14px] leading-[1.6] text-[#475569] dark:text-gray-400 mb-8">{item.desc}</p>
                                <div className="mt-auto">
                                    <span className={`rounded-md px-3 py-1.5 text-[10px] font-bold uppercase ${item.timeColor} ${item.bg}`}>
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phase 02 */}
                <div className="relative z-10 w-full mt-8">
                    {/* Glowing Timeline Vertical Line */}
                    <div className="absolute left-[10px] top-[40px] bottom-[-20px] w-[4px] bg-gradient-to-b from-[#8FA8F3] via-[#DBEAFE] to-transparent shadow-[0_0_12px_#3B82F6] rounded-full hidden md:block opacity-60 -z-10" />

                    {/* Phase Header */}
                    <div className="mb-8 flex items-center gap-6 relative md:-left-[26px]">
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-3xl dark:bg-gray-800 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                            🚀
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#EC4899] mb-1">Phase 02</p>
                            <h3 className="text-[32px] md:text-[40px] font-extrabold leading-[1.1] text-[#1E293B] dark:text-white">Thực chiến & Trải nghiệm</h3>
                        </div>
                    </div>

                    {/* Phase 02 Cards Container */}
                    <div className="grid gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4 pl-0 md:pl-10">
                        {/* Top row - 4 items */}
                        {[
                            { icon: '💼', title: 'Dự án\nLab', bg: 'bg-[#EFF6FF] dark:bg-blue-700/50' },
                            { icon: '💻', title: 'Hackathons', bg: 'bg-[#FFE4E6] dark:bg-pink-700/50' },
                            { icon: '🔬', title: 'Nghiên\ncứu', bg: 'bg-[#FEF9C3] dark:bg-yellow-700/50' },
                            { icon: '👥', title: 'Cộng\nđồng', bg: 'bg-[#F3E8FF] dark:bg-purple-700/50' },
                        ].map((item, idx) => (
                            <div key={idx} className="col-span-1 flex flex-col items-center justify-center gap-5 rounded-[32px] bg-white dark:bg-gray-800 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className={`flex h-20 w-20 items-center justify-center rounded-full ${item.bg} text-3xl`}>
                                    {item.icon}
                                </div>
                                <span className="text-[18px] leading-snug font-bold text-[#1E293B] dark:text-white text-center whitespace-pre-wrap">{item.title}</span>
                            </div>
                        ))}

                        {/* Bottom row - 2 wide items */}
                        {[
                            { icon: '🏆', title: 'Competitions', bg: 'bg-[#FEF9C3] dark:bg-yellow-700/50' },
                            { icon: '🛠️', title: 'Workshops', bg: 'bg-[#EFF6FF] dark:bg-blue-700/50' },
                        ].map((item, idx) => (
                            <div key={`bottom-${idx}`} className="col-span-2 flex flex-col items-center justify-center gap-5 rounded-[32px] bg-white dark:bg-gray-800 px-8 py-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className={`flex h-20 w-20 items-center justify-center rounded-full ${item.bg} text-3xl`}>
                                    {item.icon}
                                </div>
                                <span className="text-[18px] font-bold text-[#1E293B] dark:text-white text-center">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
