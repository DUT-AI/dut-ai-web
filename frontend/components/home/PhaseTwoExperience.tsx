"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, useScroll, useTransform, m, MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface ActivityCardData {
  title: string;
  category: string;
  description: string;
  accentGradient: string; // Top accent line gradient
  badgeClass: string;     // Theme-adaptive badge pill
  glowClass: string;      // Corner ambient glow
  actionColor: string;    // Action text & icon accent
  image: string;
  tags: string[];
}

const activities: ActivityCardData[] = [
  {
    title: "Dự án Lab & R&D Sản phẩm",
    category: "LAB WORK",
    description:
      "Trực tiếp tham gia nghiên cứu, thiết kế kiến trúc và phát triển các sản phẩm AI thực tế. Được đồng hành và hướng dẫn 1-1 cùng đội ngũ kỹ sư và giảng viên chuyên gia.",
    accentGradient: "from-[#2563EB] via-[#3B82F6] to-[#60A5FA]",
    badgeClass: "bg-blue-50 text-blue-600 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60",
    glowClass: "bg-blue-500/10 dark:bg-blue-500/15",
    actionColor: "text-blue-600 dark:text-blue-400",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80",
    tags: ["Production AI", "Full-Stack ML", "Mentorship"],
  },
  {
    title: "Chinh chiến các giải Hackathons",
    category: "COMPETITION",
    description:
      "Thử thách bản thân trong môi trường áp lực cao 24h - 48h liên tục. Biến ý tưởng đột phá thành nguyên mẫu giải pháp AI hoạt động thực tế và chinh phục ban giám khảo.",
    accentGradient: "from-[#EC4899] via-[#F43F5E] to-[#FB7185]",
    badgeClass: "bg-pink-50 text-pink-600 border-pink-200/80 dark:bg-pink-950/60 dark:text-pink-400 dark:border-pink-800/60",
    glowClass: "bg-pink-500/10 dark:bg-pink-500/15",
    actionColor: "text-pink-600 dark:text-pink-400",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80",
    tags: ["48h Sprint", "Team Collaboration", "Problem Solving"],
  },
  {
    title: "Nghiên cứu Khoa học & Công bố",
    category: "ACADEMIC",
    description:
      "Đào sâu các bài toán học máy tiên tiến, thực nghiệm trên cụm GPU của lab và hướng đến việc công bố các bài báo tại các hội nghị, tạp chí khoa học uy tín (Scopus/ISI).",
    accentGradient: "from-[#191970] via-[#1E3A8A] to-[#2563EB]",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60",
    glowClass: "bg-indigo-500/10 dark:bg-indigo-500/15",
    actionColor: "text-indigo-600 dark:text-indigo-400",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80",
    tags: ["Research Paper", "GPU Clusters", "Novel Architecture"],
  },
  {
    title: "Cộng đồng & Mạng lưới DUT AI",
    category: "COMMUNITY",
    description:
      "Kết nối mạng lưới cựu sinh viên, giao lưu cùng các chuyên gia hàng đầu đang làm việc tại các tập đoàn công nghệ lớn. Mở rộng cơ hội thực tập, việc làm và học bổng.",
    accentGradient: "from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]",
    badgeClass: "bg-sky-50 text-sky-600 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/60",
    glowClass: "bg-sky-500/10 dark:bg-sky-500/15",
    actionColor: "text-sky-600 dark:text-sky-400",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    tags: ["Alumni Network", "Tech Sharing", "Career Pathway"],
  },
  {
    title: "Đấu trường Kaggle & Competitions",
    category: "CONTEST",
    description:
      "Thực chiến trên các nền tảng thi đấu dữ liệu toàn cầu như Kaggle, Grandmaster benchmarks và các kỳ thi Olympic Tin học, ICPC cấp quốc gia và khu vực.",
    accentGradient: "from-[#DB2777] via-[#EC4899] to-[#F472B6]",
    badgeClass: "bg-rose-50 text-rose-600 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60",
    glowClass: "bg-rose-500/10 dark:bg-rose-500/15",
    actionColor: "text-rose-600 dark:text-rose-400",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80",
    tags: ["Kaggle Master", "Feature Eng", "Model Stacking"],
  },
  {
    title: "Workshops & Masterclasses Chuyên sâu",
    category: "WORKSHOPS",
    description:
      "Tham gia chuỗi hội thảo kỹ thuật chuyên đề định kỳ hàng tháng về Generative AI, Large Language Models (LLM), Multi-Modal và quy trình MLOps tự động hóa.",
    accentGradient: "from-[#1D4ED8] via-[#2563EB] to-[#0284C7]",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60",
    glowClass: "bg-blue-500/10 dark:bg-blue-500/15",
    actionColor: "text-blue-600 dark:text-blue-400",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80",
    tags: ["Monthly Talks", "Hands-on Labs", "Industry Speakers"],
  },
];

export default function PhaseTwoExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="relative w-full">
        {/* Stacking Cards List */}
        <div className="flex flex-col gap-12 pb-24">
          {activities.map((item, idx) => {
            // Target scale down slightly as subsequent cards overlay on top
            const targetScale = 1 - (activities.length - 1 - idx) * 0.04;
            return (
              <StackingCard
                key={item.title}
                item={item}
                index={idx}
                total={activities.length}
                progress={scrollYProgress}
                range={[idx * 0.15, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}

interface StackingCardProps {
  item: ActivityCardData;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function StackingCard({ item, index, total, progress, range, targetScale }: StackingCardProps) {
  // Scale down when subsequent cards slide up on top of this card
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="sticky top-28 w-full flex items-center justify-center"
      style={{
        zIndex: index + 1,
      }}
    >
      <m.div
        style={{
          scale,
          top: `calc(10px + ${index * 24}px)`,
        }}
        className="w-full rounded-[36px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200/90 dark:border-slate-800 overflow-hidden relative transition-all duration-300"
      >
        {/* Top accent gradient bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accentGradient}`} />

        {/* Ambient background glow */}
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full ${item.glowClass} blur-3xl pointer-events-none`} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Content: 6 - 7 cols */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Category Badge & Index Indicator */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full border backdrop-blur-md ${item.badgeClass}`}
                >
                  {item.category}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                  Phase 02 • 0{index + 1} / 0{total}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E293B] dark:text-white leading-[1.2] tracking-tight mb-4">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal mb-6 max-w-xl">
                {item.description}
              </p>
            </div>

            {/* Tags & Action row */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                >
                  #{tag}
                </span>
              ))}

              <div
                className={`ml-auto hidden sm:flex items-center gap-1.5 text-xs font-bold ${item.actionColor} group cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <span>Khám phá</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Right Visual Image Card: 5 - 6 cols */}
          <div className="md:col-span-6 lg:col-span-5 w-full">
            <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] rounded-[24px] overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-700/60 group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

