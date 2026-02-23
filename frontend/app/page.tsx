import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import AboutUs from '@/components/AboutUs'
import OrgSystem from '@/components/OrgSystem'
import EventImagePool from '@/components/EventImagePool'
import Link from '@/components/Link'
import Image from 'next/image'

/* ─── Section label ─── */
function SectionLabel({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className={`h-1 w-7 rounded-full ${colorClass}`} />
      <span className={`text-xs font-bold uppercase tracking-widest ${colorClass.replace('bg-', 'text-')}`}>
        {label}
      </span>
    </div>
  )
}

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="min-h-screen pb-16">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-rose-50 py-16 md:py-24 dark:from-primary-950 dark:via-gray-950 dark:to-gray-900">

        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-200 opacity-40 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-rose-200 opacity-30 blur-3xl dark:opacity-10" />

        <div className="relative z-10 px-6 md:px-12">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">

            {/* ── Left: Text content ── */}
            <div className="min-w-0 flex-1 text-center md:text-left">

              {/* Badge tags */}
              <div className="mb-5 flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="rounded-full border border-primary-300 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  AI Learners
                </span>
                <span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  2025 Edition
                </span>
                <span className="rounded-full border border-primary-300 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  Innovation
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-primary-900 sm:text-5xl md:text-[3.2rem] dark:text-white">
                Câu lạc bộ{' '}
                <span className="text-rose-500 dark:text-rose-400">Trí tuệ nhân tạo</span>
                <br />
                DUT
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-primary-600 mx-auto md:mx-0 md:text-lg dark:text-gray-400">
                Khám phá thế giới AI cùng cộng đồng DUT.AI. Nơi niềm
                đam mê công nghệ được chắp cánh bằng thực tiễn và
                tinh thần đồng đội.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-95 dark:bg-primary-700"
                >
                  Projects ✦
                </Link>
                <Link
                  href="#roadmap"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary-300 bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-primary-700 shadow-sm transition-all hover:border-primary-500 hover:bg-primary-50 active:scale-95 dark:border-primary-600 dark:bg-transparent dark:text-primary-300 dark:hover:bg-primary-900/20"
                >
                  Roadmap ↗
                </Link>
              </div>
            </div>

            {/* ── Right: Logo image in styled container ── */}
            <div className="relative flex shrink-0 items-center justify-center">
              {/* Outer glow ring */}
              <div className="absolute h-[260px] w-[260px] rounded-full bg-primary-200 opacity-50 blur-2xl dark:opacity-20" />
              {/* Card */}
              <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-primary-100 dark:bg-primary-900/50 dark:ring-primary-800 md:h-[260px] md:w-[260px]">
                <Image
                  src="/static/images/logo.jpg"
                  alt="DUT AI Club Logo"
                  width={180}
                  height={180}
                  className="h-40 w-40 rounded-2xl object-contain md:h-48 md:w-48"
                  priority
                />
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-primary-100 pt-10 dark:border-primary-800/40">
            {[
              { value: '25+', label: 'Thành Viên' },
              { value: '10+', label: 'Dự án' },
              { value: '5+', label: 'Sự kiện' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-extrabold text-rose-500 dark:text-rose-400 md:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-300">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ROADMAP
      ═══════════════════════════════════════════ */}
      <section id="roadmap" className="px-6 py-14 md:px-12 bg-gradient-to-b from-white to-primary-50 dark:from-gray-950 dark:to-gray-900 border-t border-primary-100 dark:border-gray-800">
        {/* Header */}
        <div className="mb-2 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-widest text-primary-900 dark:text-white md:text-4xl">
            Roadmap to AI Engineer
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-5 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            • Lộ trình hoạt động tại DUT AI
          </div>
        </div>

        {/* Phase 01 */}
        <div className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-xl dark:bg-primary-800">
              🎓
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 dark:text-primary-400">Phase 01</p>
              <h3 className="text-xl font-bold text-primary-900 dark:text-white">Học tập cùng Mentor</h3>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🖥️', title: 'Python cơ bản', desc: 'Xây dựng nền tảng lập trình vững chắc với ngôn ngữ phổ biến nhất trong AI.', time: 'Tháng 1–2', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '∑', title: 'Toán cho AI', desc: 'Đại số tuyến tính, giải tích và tối ưu hóa – ngôn ngữ của trí tuệ nhân tạo.', time: 'Tháng 2–3', accent: 'border-rose-300 dark:border-rose-700' },
              { icon: '📊', title: 'Thống kê & ML', desc: 'Từ các thuật toán cổ điển đến các mô hình dự đoán hiện đại nhất.', time: 'Tháng 3–4', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '🧠', title: 'Deep Learning', desc: 'Mạng nơ-ron sâu và các kiến trúc Transformer đột phá.', time: 'Tháng 4–5', accent: 'border-rose-300 dark:border-rose-700' },
              { icon: '👁️', title: 'Computer Vision', desc: 'Xử lý hình ảnh, nhận diện vật thể và phân đoạn ngữ nghĩa.', time: 'Tháng 5–6', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '💬', title: 'NLP & Generative AI', desc: 'Xử lý ngôn ngữ tự nhiên và kỷ nguyên của Generative AI.', time: 'Tháng 6–7', accent: 'border-rose-300 dark:border-rose-700' },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800/60 ${item.accent}`}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-xl dark:bg-primary-900/40">
                  {item.icon}
                </div>
                <h4 className="font-bold text-primary-900 dark:text-white">{item.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-primary-600 dark:text-gray-400">{item.desc}</p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 02 */}
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-xl dark:bg-rose-900/40">
              🚀
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">Phase 02</p>
              <h3 className="text-xl font-bold text-primary-900 dark:text-white">Thực chiến &amp; Trải nghiệm</h3>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { icon: '🧪', title: 'Dự án Lab', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '💻', title: 'Hackathons', accent: 'border-rose-300 dark:border-rose-700' },
              { icon: '🔬', title: 'Nghiên cứu', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '👥', title: 'Cộng đồng', accent: 'border-rose-300 dark:border-rose-700' },
              { icon: '🏆', title: 'Competitions', accent: 'border-primary-300 dark:border-primary-700' },
              { icon: '🛠️', title: 'Workshops', accent: 'border-rose-300 dark:border-rose-700' },
            ].map((item) => (
              <div key={item.title} className={`flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800/60 ${item.accent}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl dark:bg-primary-900/40">
                  {item.icon}
                </div>
                <span className="font-bold text-primary-900 dark:text-white">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUR PORTFOLIO
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-16 md:px-12 border-t border-primary-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-500 dark:text-primary-400">Our Portfolio</span>
          </div>
          <h2 className="text-4xl font-extrabold text-primary-900 dark:text-white md:text-5xl">
            Next-Gen
          </h2>
          <h2 className="text-4xl font-extrabold text-rose-500 dark:text-rose-400 md:text-5xl">
            AI Innovations
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-600 dark:text-gray-400">
            Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người.
            Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI.
          </p>
        </div>

        {/* Project cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              num: '01',
              tag: 'NLP',
              title: 'DUT-AI Chatbot',
              desc: 'Hệ thống chatbot thông minh hỗ trợ sinh viên giải đáp thắc mắc về lộ trình học tập và thủ tục hành chính.',
              bg: 'from-primary-700 to-primary-500',
            },
            {
              num: '02',
              tag: 'NLP',
              title: 'Speakee – AI Speaking Coach',
              desc: 'Trợ lý luyện nói thông minh giúp bạn tự giao tiếp tiếng Anh mỗi ngày bằng việc luyện tập, nhận phản hồi tức thì và theo dõi tiến bộ cá nhân hóa bằng AI.',
              bg: 'from-primary-600 to-rose-400',
            },
            {
              num: '03',
              tag: 'NLP',
              title: 'Smart Rescue – Ứng dụng cứu hộ thông minh',
              desc: 'Hệ thống cứu hộ khẩn cấp tích hợp định vị GPS thời gian thực, giúp kết nối người gặp sự cố với lực lượng hỗ trợ gần nhất và tối ưu hóa lộ trình di chuyển bằng thuật toán AI.',
              bg: 'from-primary-500 to-primary-300',
            },
          ].map((p) => (
            <div key={p.title} className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-primary-100 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 dark:ring-primary-800">
              {/* Thumbnail */}
              <div className={`relative flex h-44 w-full items-center justify-center bg-gradient-to-br ${p.bg}`}>
                <span className="text-[80px] font-black leading-none text-white/20 select-none">{p.num}</span>
                {/* HOT RELEASE badge */}
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-700 shadow">
                  Hot Release
                </span>
              </div>
              {/* Content */}
              <div className="p-5">
                <span className="mb-2 inline-block rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                  {p.tag}
                </span>
                <h3 className="font-bold text-primary-900 dark:text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-primary-600 dark:text-gray-400">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-95 dark:bg-primary-700"
          >
            Xem tất cả dự án →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GIỚI THIỆU
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-8 md:px-12 border-t border-primary-100 dark:border-gray-800">
        <SectionLabel label="Giới thiệu" colorClass="bg-primary-400 text-primary-600 dark:text-primary-400" />
        <AboutUs />
      </section>

      {/* ═══════════════════════════════════════════
          ĐỘI NGŨ
      ═══════════════════════════════════════════ */}
      <section className="py-8 bg-rose-50 dark:bg-gray-900 border-t border-rose-100 dark:border-gray-800">
        <div className="px-6 md:px-12">
          <SectionLabel label="Đội ngũ" colorClass="bg-rose-400 text-rose-600 dark:text-rose-400" />
        </div>
        <OrgSystem />
      </section>

      {/* ═══════════════════════════════════════════
          DUT AI MOMENTS
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-16 md:px-12 border-t border-primary-100 dark:border-gray-800 bg-gradient-to-b from-primary-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="text-primary-400">✦</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-500 dark:text-primary-400">Digital Scrapbook</span>
          </div>
          <h2 className="text-4xl font-extrabold md:text-5xl">
            <span className="text-primary-900 dark:text-white">DUT AI </span>
            <span className="text-rose-500 dark:text-rose-400">Moments</span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-primary-600 dark:text-gray-400">
            A dynamic collection of our journey in Artificial Intelligence. Modern, organic, and full of life.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {[
            { tag: '#WORKSHOP', title: 'Deep Learning Series', sub: 'Session #01: Neural Networks', tall: true, color: 'bg-primary-700' },
            { tag: '#SHOWCASE', title: 'Demo Day', sub: 'Pitching AI solutions', tall: false, color: 'bg-primary-100' },
            { tag: '#IDEATION', title: 'Ideation Night', sub: 'Midnight thoughts', tall: false, color: 'bg-rose-100' },
            { tag: '#CONNECTED', title: 'Networking', sub: 'Industry connections', tall: true, color: 'bg-primary-500' },
            { tag: '#PAIR DEV', title: 'Collaborative Coding', sub: 'Building the core engine', tall: true, color: 'bg-primary-900' },
            { tag: '#TEAMWORK', title: 'Weekly Sync', sub: 'Strategy & Planning', tall: false, color: 'bg-rose-200' },
            { tag: '#FOCUS', title: 'Lab Session', sub: 'Hands-on experimentation', tall: false, color: 'bg-primary-200' },
            { tag: '#CELEBRATION', title: 'Team Bonding', sub: 'Milestones & Memories', tall: true, color: 'bg-primary-400' },
          ].map((m) => (
            <div key={m.title} className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-100 dark:bg-gray-800 dark:ring-primary-800`}>
              <div className={`flex items-center justify-center ${m.color} ${m.tall ? 'h-48' : 'h-32'} relative`}>
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary-700 shadow">{m.tag}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-primary-900 dark:text-white">{m.title}</p>
                <p className="text-[11px] text-primary-500 dark:text-gray-400">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary-300 bg-white px-8 py-3 text-sm font-bold text-primary-700 transition-all hover:border-primary-500 hover:bg-primary-50 active:scale-95 dark:border-primary-600 dark:bg-transparent dark:text-primary-300"
          >
            View Full Album →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIN TỨC
      ═══════════════════════════════════════════ */}
      <section className="px-6 py-8 md:px-12 bg-primary-50 dark:bg-gray-900 border-t border-primary-100 dark:border-gray-800">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <SectionLabel label="Tin tức" colorClass="bg-primary-400 text-primary-600 dark:text-primary-400" />
            <h2 className="mt-1 text-2xl font-bold text-primary-900 dark:text-white">
              Sự kiện &amp; Bài viết mới nhất
            </h2>
          </div>
          <Link
            href="/blog"
            className="mt-1 hidden shrink-0 items-center gap-1 rounded-full bg-primary-900 px-5 py-2 text-sm font-bold text-white shadow-sm sm:flex dark:bg-primary-700"
          >
            Tất cả →
          </Link>
        </div>
        <Main posts={posts.slice(0, 3)} />
      </section>

      {/* ═══════════════════════════════════════════
          READY TO EVOLVE — CTA
      ═══════════════════════════════════════════ */}
      <section className="border-t border-primary-100 dark:border-gray-800">
        <div className="grid md:grid-cols-2">
          {/* Left: text + contact */}
          <div className="bg-gradient-to-br from-rose-50 via-primary-50 to-primary-100 px-8 py-16 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-500">Connect with us</p>
            <h2 className="text-4xl font-black uppercase leading-tight text-primary-900 dark:text-white md:text-5xl">
              Ready to<br />
              <span className="text-rose-500">Evolve?</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-600 dark:text-gray-400">
              Trở thành một phần của cộng đồng DUT AI Club và
              cùng chúng mình xây dựng tương lai từ hôm nay.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  @
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Email</p>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">dut.ai.clb@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  📍
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Location</p>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">54 Nguyen Luong Bang, Da Nang</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: value pillars grid + logo */}
          <div className="grid grid-cols-2 grid-rows-3 bg-gradient-to-br from-primary-100 to-rose-100 dark:from-gray-800 dark:to-gray-900">
            {/* Logo cell */}
            <div className="row-span-2 flex items-center justify-center border-r border-b border-white/40 p-6">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                <Image
                  src="/static/images/logo.jpg"
                  alt="DUT AI Logo"
                  width={96}
                  height={96}
                  className="h-24 w-24 object-contain"
                />
              </div>
            </div>
            {/* Pillar: Sáng tạo */}
            <div className="flex flex-col items-start justify-center gap-2 border-b border-white/40 bg-white/70 p-6 dark:bg-gray-700/50">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-primary-900 dark:text-white">Sáng tạo</span>
            </div>
            {/* Pillar: Nỗ lực */}
            <div className="flex flex-col items-start justify-center gap-2 border-r border-b border-white/40 bg-primary-200/60 p-6 dark:bg-primary-900/40">
              <span className="text-2xl">✦</span>
              <span className="font-bold text-primary-900 dark:text-white">Nỗ lực</span>
            </div>
            {/* Pillar: Vươn xa */}
            <div className="flex flex-col items-start justify-center gap-2 border-white/40 bg-white/70 p-6 dark:bg-gray-700/50">
              <span className="text-2xl">⊞</span>
              <span className="font-bold text-primary-900 dark:text-white">Vươn xa</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}