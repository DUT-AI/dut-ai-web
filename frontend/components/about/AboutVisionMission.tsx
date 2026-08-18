const VISION_MISSION = [
    {
        title: 'Tầm nhìn',
        content:
            'Trở thành cộng đồng sinh viên AI hàng đầu miền Trung, nơi kiến thức, đam mê và ứng dụng thực tế gặp nhau để kiến tạo tương lai, hướng tới kết nối mạng lưới AI quốc tế.',
    },
    {
        title: 'Sứ mệnh',
        content:
            'Xây dựng môi trường học tập hiện đại, kết nối sinh viên với doanh nghiệp, và thúc đẩy ứng dụng AI vì sự phát triển của cộng đồng: Kết nối — Phát triển — Chia sẻ.',
    },
]

export default function AboutVisionMission() {
    return (
        <section className="grid gap-6 md:grid-cols-2">
            {VISION_MISSION.map((item) => (
                <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200/80 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
                >
                    <h3 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                        {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.content}
                    </p>
                </article>
            ))}
        </section>
    )
}
