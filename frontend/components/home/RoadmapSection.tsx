import Heading from "./Heading";
import ModernTimeline, { TimelineStep } from "@/components/ui/modern-timeline";
import PhaseTwoExperience from "./PhaseTwoExperience";

const roadmapSteps: TimelineStep[] = [
    {
        title: "Python",
        description: "Xây dựng nền tảng lập trình vững chắc, cấu trúc dữ liệu.",
    },
    {
        title: "Mathematics for AI",
        description: "Đại số tuyến tính, vi tích phân, xác suất thống kê và các phương pháp tối ưu hóa cốt lõi.",
    },
    {
        title: "Basic Data Science & ML",
        description: "Phân tích dữ liệu thăm dò, xử lý đặc trưng và các thuật toán học máy kinh điển.",
    },
    {
        title: "Basic Deep Learning",
        description: "Kiến trúc mạng nơ-ron nền tảng, hàm mất mát và thuật toán lan truyền ngược.",
    },
    {
        title: "Computer Vision",
        description: "Xử lý ảnh số, trích xuất đặc trưng hình ảnh, các mô hình nổi tiếng, transfer learning.",
    },
    {
        title: "Natural Language Processing",
        description: "Xử lý văn bản, tiền xử lý ngôn ngữ, Word Embeddings, mô hình Sequence-to-Sequence và cơ chế Attention.",
    },
    {
        title: "Advanced Deep Learning",
        description: "Ứng dụng các mô hình CV và NLP vào các bài toán thực tế, tối ưu hóa và kiến trúc chuyên sâu.",
    },
    {
        title: "Audio Processing",
        description: "Xử lý tín hiệu âm thanh số, trích xuất đặc trưng phổ, Speech-to-Text và Text-to-Speech.",
    },
    {
        title: "Generative AI",
        description: "Mô hình sinh hình ảnh và nội dung.",
    },
    {
        title: "Large Language Models",
        description: "Huấn luyện và tinh chỉnh LLM, Retrieval-Augmented Generation, Agentic AI và LLMOps.",
    },
    {
        title: "MLOps",
        description: "Đóng gói và triển khai mô hình AI, xây dựng CI/CD pipeline, monitoring và quản lý vòng đời hệ thống.",
    },
];

export default function RoadmapSection() {
    return (
        <section id="roadmap" className="px-6 md:px-12 max-w-[1400px] mx-auto w-full">
            {/* Header */}
            <Heading heading="ROADMAP TO" subHeading="AI ENGINEER" description="Lộ trình học tập và phát triển bản thân tại DUT AI." badge="ROADMAP" isSubHeadingEnter={true} />

            <div className="relative flex flex-col gap-16 md:pl-8">
                {/* Phase 01 */}
                <div className="relative z-10 w-full">
                    {/* Phase Header */}
                    <div className="mb-6 flex items-center gap-6 relative md:-left-[26px]">
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-3xl dark:bg-gray-800 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                            🎓
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#2563EB] mb-1">Phase 01</p>
                            <h3 className="text-[32px] md:text-[40px] font-extrabold leading-[1.1] text-[#1E293B] dark:text-white">Học tập cùng Mentor</h3>
                        </div>
                    </div>

                    {/* Modern Timeline */}
                    <div className="w-full">
                        <ModernTimeline steps={roadmapSteps} />
                    </div>
                </div>

                {/* Phase 02 */}
                <div className="relative z-10 w-full mt-12">
                    {/* Phase Header */}
                    <div className="mb-8 flex items-center gap-6 relative md:-left-[26px]">
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-3xl dark:bg-gray-800 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                            🚀
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#EC4899] mb-1">Phase 02</p>
                            <h3 className="text-[32px] md:text-[40px] font-extrabold leading-[1.1] text-[#1E293B] dark:text-white">Thực chiến & Trải nghiệm</h3>
                        </div>
                    </div>

                    {/* New Phase 02 Experience Layout */}
                    <div className="w-full">
                        <PhaseTwoExperience />
                    </div>
                </div>
            </div>
        </section>
    )
}
