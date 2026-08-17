const CORE_VALUES = [
    { label: '# Sáng tạo', color: 'border-blue-500/30 bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
    { label: '# Hợp tác', color: 'border-indigo-500/30 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
    { label: '# Phát triển', color: 'border-emerald-500/30 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
    { label: '# Tác động', color: 'border-amber-500/30 bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
]

export default function AboutCoreValues() {
    return (
        <section className="rounded-3xl border border-slate-200/80 bg-white/70 px-8 py-12 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Những điều chúng mình trân trọng
            </p>
            <h2 className="mt-2 mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">
                Giá trị cốt lõi
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {CORE_VALUES.map((value) => (
                    <span
                        key={value.label}
                        className={`rounded-full border px-6 py-2.5 text-sm font-bold shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 ${value.color}`}
                    >
                        {value.label}
                    </span>
                ))}
            </div>
        </section>
    )
}
