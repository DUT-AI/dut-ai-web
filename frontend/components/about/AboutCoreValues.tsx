const CORE_VALUES = [
    { label: '# Sáng tạo', tone: 'indigo' },
    { label: '# Hợp tác', tone: 'violet' },
    { label: '# Phát triển', tone: 'pink' },
    { label: '# Tác động', tone: 'blue' },
]

export default function AboutCoreValues() {
    return (
        <section className="space-y-6 text-center">
            <h2 className="about-section-title about-section-title-muted">Giá trị cốt lõi</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {CORE_VALUES.map((value) => (
                    <span key={value.label} className={`about-value-chip about-value-chip-${value.tone}`}>
                        {value.label}
                    </span>
                ))}
            </div>
        </section>
    )
}
