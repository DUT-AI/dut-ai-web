const INTRO_CARDS = [
    {
        title: 'Chúng tôi là ai?',
        description:
            'DUT AI Club là câu lạc bộ học thuật trực thuộc Trường Đại học Bách Khoa — ĐHĐN. Chúng tôi tập hợp những sinh viên đam mê AI, cùng nhau khám phá, nghiên cứu và ứng dụng Trí tuệ Nhân tạo vào giải quyết các bài toán thực tiễn.',
        tone: 'blue',
        icon: (
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'Tại sao chúng tôi tồn tại?',
        description:
            'Chúng tôi tin rằng AI là chìa khóa định hình tương lai. DUT AI Club ra đời nhằm rút ngắn khoảng cách giữa lý thuyết giảng đường và sản phẩm thực tế, xây dựng một sân chơi bổ ích, chuyên nghiệp cho sinh viên Bách Khoa.',
        tone: 'pink',
        icon: (
            <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
]

export default function AboutIntroCards() {
    return (
        <section className="grid gap-6 md:grid-cols-2">
            {INTRO_CARDS.map((card) => (
                <article
                    key={card.title}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
                >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                        {card.icon}
                    </div>
                    <h2 className="mb-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                        {card.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {card.description}
                    </p>
                </article>
            ))}
        </section>
    )
}
