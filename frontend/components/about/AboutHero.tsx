type AboutHeroProps = {
    eyebrow: string
    titleTop: string
    titleBottom: string
    description: string
}

export default function AboutHero({ eyebrow, titleTop, titleBottom, description }: AboutHeroProps) {
    return (
        <section className="relative px-6 pt-36 pb-12 text-center md:px-12 md:pt-44 md:pb-16">
            <div className="mx-auto max-w-4xl">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur-md dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-400">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>{eyebrow}</span>
                </div>

                {/* Main Title */}
                <h1 className="mt-6 text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
                        {titleTop}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                        {titleBottom}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
                    {description}
                </p>
            </div>
        </section>
    )
}
