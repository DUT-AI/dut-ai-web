import { glass, jakarta } from './styles'

export type TabKey = 'features' | 'demo' | 'tech' | 'team'

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'features', icon: '👁', label: 'Tính năng\nchi tiết' },
  { key: 'demo', icon: '🚀', label: 'Demo\ndự án' },
  { key: 'tech', icon: '💻', label: 'Công nghệ\nsử dụng' },
  { key: 'team', icon: '👥', label: 'Thành viên\ntham gia' },
]

interface CategoryTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`group flex items-center gap-3 overflow-hidden rounded-[40px] px-6 py-6 text-left transition-all duration-300 hover:scale-[1.02] sm:gap-4 sm:px-8 sm:py-7 ${isActive ? 'ring-2 ring-white/40' : ''
              }`}
            style={{
              ...glass,
              background: isActive ? 'rgba(255,255,255,0.25)' : glass.background,
            }}
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-sm sm:h-11 sm:w-11">
              {tab.icon}
            </span>
            <div>
              <p
                className="whitespace-pre-line text-sm font-bold leading-tight text-white sm:text-base"
                style={{ ...jakarta, lineHeight: '1.25em' }}
              >
                {tab.label}
              </p>
              <p className="mt-1 text-xs text-[#F1F5F9] sm:text-sm" style={jakarta}>
                Chi tiết
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
