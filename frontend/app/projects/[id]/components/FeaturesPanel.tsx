import type { Project } from 'app/api-client'
import { glass, jakarta } from './styles'

interface FeaturesPanelProps {
  project: Project
}

export default function FeaturesPanel({ project }: FeaturesPanelProps) {
  return (
    <div className="overflow-y-auto h-[700px] lg:h-[800px] rounded-[40px] p-8 sm:p-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent" style={glass}>
      {/* Badge row */}
      {/* <div className="mb-6 flex items-center justify-between">
        <span className="text-3xl">🚀</span>
        <span
          className="text-xs font-bold uppercase tracking-[0.1em]"
          style={{ ...jakarta, color: 'rgba(255,255,255,0.6)' }}
        >
          Innovation Hub
        </span>
      </div> */}

      <h3
        className="mb-6 text-2xl font-bold text-white sm:text-3xl"
        style={{ ...jakarta, lineHeight: '1.111em' }}
      >
        Key Features
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-lg font-bold text-white sm:text-xl" style={jakarta}>
            01. AI Speech Recognition
          </h4>
          <ul className="list-inside list-disc space-y-1.5 text-[#F1F5F9]" style={jakarta}>
            <li className="text-sm sm:text-base">Hiển thị giao diện theo thời gian thực</li>
            <li className="text-sm sm:text-base">
              Chuyển giọng nói thành văn bản (speech-to-text)
            </li>
            <li className="text-sm sm:text-base">Phân tích đối chiếu phát âm</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-lg font-bold text-white sm:text-xl" style={jakarta}>
            02. Instant AI Feedback
          </h4>
          <ul className="list-inside list-disc space-y-1.5 text-[#F1F5F9]" style={jakarta}>
            <li className="text-sm sm:text-base">Đánh giá Pronunciation (phát âm)</li>
            <li className="text-sm sm:text-base">Đánh giá Fluency (độ trôi chảy)</li>
            <li className="text-sm sm:text-base">Phát hiện lỗi Grammar (ngữ pháp)</li>
            <li className="text-sm sm:text-base">Gợi ý sửa câu chính xác</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
