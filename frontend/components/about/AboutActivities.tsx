const ACTIVITIES = [
    {
        title: 'Workshops',
        description: 'Chia sẻ kiến thức chuyên sâu từ cơ bản đến nâng cao.',
        tone: 'indigo',
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        ),
    },
    {
        title: 'Projects',
        description: 'Xây dựng các sản phẩm AI thực tế có tác động xã hội.',
        tone: 'violet',
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
            </svg>
        ),
    },
    {
        title: 'Hackathons',
        description: 'Sân chơi thi đấu lập trình kịch tính và sáng tạo.',
        tone: 'pink',
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Research',
        description: 'Nghiên cứu các xu hướng và bài báo khoa học về AI.',
        tone: 'green',
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0v1m0 12v1m7-7h-1M5 11H4m11.95 4.95l-.707-.707M6.757 6.757l-.707-.707m9.9 0l-.707.707m-8.486 8.486l-.707.707"
                />
            </svg>
        ),
    },
]

export default function AboutActivities() {
    return (
        <section className="space-y-8">
            <h2 className="about-section-title text-center">Hoạt động tiêu biểu</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ACTIVITIES.map((item) => (
                    <article key={item.title} className="about-card about-activity-card text-center">
                        <div className={`about-icon-pill about-icon-pill-${item.tone} mx-auto`}>
                            {item.icon}
                        </div>
                        <h3 className="about-activity-title">{item.title}</h3>
                        <p className="about-activity-copy">{item.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
