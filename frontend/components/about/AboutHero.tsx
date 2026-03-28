type AboutHeroProps = {
    eyebrow: string
    titleTop: string
    titleBottom: string
    description: string
}

export default function AboutHero({ eyebrow, titleTop, titleBottom, description }: AboutHeroProps) {
    return (
        <section className="about-hero px-5 pt-32 pb-10 sm:px-6 sm:pt-36 sm:pb-12 md:px-12 md:pt-40 md:pb-14 lg:pt-44">
            <div className="mx-auto max-w-5xl text-center">
                <div className="about-eyebrow mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 sm:mb-5">
                    <span className="about-eyebrow-dot" aria-hidden="true" />
                    <span>{eyebrow}</span>
                </div>

                <h1 className="about-hero-title">
                    <span>{titleTop}</span>
                    <br />
                    <span>{titleBottom}</span>
                </h1>

                <p className="about-hero-description mx-auto mt-4 max-w-2xl sm:mt-5">{description}</p>
            </div>
        </section>
    )
}
