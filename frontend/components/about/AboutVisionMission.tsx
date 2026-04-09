const VISION_MISSION = [
    {
        title: 'Tầm nhìn',
        content:
            'Trở thành cộng đồng sinh viên AI hàng đầu miền Trung, nơi hội tụ và ươm mầm cho những tài năng công nghệ vươn tầm quốc tế.',
    },
    {
        title: 'Sứ mệnh',
        content:
            'Xây dựng môi trường học tập hiện đại, kết nối sinh viên với doanh nghiệp, và thúc đẩy ứng dụng AI vì sự phát triển của cộng đồng.',
    },
]

export default function AboutVisionMission() {
    return (
        <section className="grid gap-6 md:grid-cols-2">
            {VISION_MISSION.map((item) => (
                <article key={item.title} className="about-card about-vm-card">
                    <h3 className="about-vm-title">{item.title}</h3>
                    <p className="about-vm-copy">{item.content}</p>
                </article>
            ))}
        </section>
    )
}
