const ACTIVITIES = [
    {
        title: 'Workshops',
        description: 'Chuỗi buổi học thực hành từ cơ bản đến nâng cao về AI, Machine Learning và Data Science.',
        icon: '📚',
    },
    {
        title: 'Projects',
        description: 'Triển khai các dự án AI thực tế, giải quyết các bài toán trong đời sống và cộng đồng.',
        icon: '💻',
    },
    {
        title: 'Hackathons',
        description: 'Thi đua sáng tạo, xây dựng sản phẩm AI trong thời gian ngắn cùng đồng đội.',
        icon: '⚡',
    },
    {
        title: 'Research',
        description: 'Nghiên cứu các chủ đề AI tiên tiến và công bố kết quả trong cộng đồng sinh viên.',
        icon: '🔬',
    },
]

export default function AboutActivities() {
    return (
        <section className="space-y-8">
            <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Những gì chúng mình làm
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    Hoạt động tiêu biểu
                </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {ACTIVITIES.map((item) => (
                    <article
                        key={item.title}
                        className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white/70 p-7 text-center shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-slate-800">
                            {item.icon}
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {item.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}
