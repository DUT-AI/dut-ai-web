const INTRO_CARDS = [
    {
        title: 'Chúng tôi là ai?',
        description:
            'DUT AI Club là cộng đồng sinh viên đam mê công nghệ tại Trường Đại học Bách Khoa - ĐHĐN. Chúng tôi tập hợp những cá nhân khao khát ứng dụng AI để giải quyết các vấn đề thực tiễn trong cuộc sống.',
        tone: 'indigo',
        icon: (
            <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
    },
    {
        title: 'Tại sao chúng tôi tồn tại?',
        description:
            'Trong kỷ nguyên số, AI không chỉ là công cụ mà là nền tảng. Chúng tôi tồn tại để rút ngắn khoảng cách giữa lý thuyết học thuật và ứng dụng công nghiệp, chuẩn bị hành trang vững chắc cho thế hệ kỹ sư tương lai.',
        tone: 'pink',
        icon: (
            <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
]

export default function AboutIntroCards() {
    return (
        <section className="grid gap-6 md:grid-cols-2">
            {INTRO_CARDS.map((card) => (
                <article key={card.title} className="about-card about-card-lg">
                    <div className={`about-icon-pill about-icon-pill-${card.tone}`}>{card.icon}</div>
                    <h2 className="about-card-title">{card.title}</h2>
                    <p className="about-card-copy">{card.description}</p>
                </article>
            ))}
        </section>
    )
}
