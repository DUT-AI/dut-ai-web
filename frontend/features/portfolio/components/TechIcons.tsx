import React from 'react'
import { Code2 } from 'lucide-react'
import { CgCPlusPlus } from 'react-icons/cg'
import {
  DiGit,
  DiJava,
  DiJavascript1,
  DiMongodb,
  DiNodejs,
  DiReact,
} from 'react-icons/di'
import {
  SiAmazonaws,
  SiAngular,
  SiBootstrap,
  SiC,
  SiCss3,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiGithub,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJupyter,
  SiKubernetes,
  SiLinux,
  SiMacos,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiOpencv,
  SiPostgresql,
  SiPostman,
  SiPycharm,
  SiPytorch,
  SiPython,
  SiRedis,
  SiRust,
  SiSlack,
  SiSqlite,
  SiSupabase,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVercel,
  SiVisualstudiocode,
  SiVuedotjs,
} from 'react-icons/si'
import { TbBrandReactNative } from 'react-icons/tb'

export interface TechIconProps {
  name: string
  className?: string
  mini?: boolean
  showLabel?: boolean
}

// Complete authentic icon mapping matching my-cv & industry brand standards
const ICON_COMPONENT_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Programming Languages
  python: SiPython,
  py: SiPython,
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: DiJavascript1,
  js: DiJavascript1,
  'c++': CgCPlusPlus,
  cpp: CgCPlusPlus,
  c: SiC,
  java: DiJava,
  go: SiGo,
  golang: SiGo,
  rust: SiRust,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  sql: SiPostgresql,

  // Frameworks & Web
  react: DiReact,
  'react native': TbBrandReactNative,
  'react-native': TbBrandReactNative,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  next: SiNextdotjs,
  nodejs: DiNodejs,
  'node.js': DiNodejs,
  node: DiNodejs,
  express: SiExpress,
  expressjs: SiExpress,
  'express.js': SiExpress,
  nestjs: SiNestjs,
  nest: SiNestjs,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  angular: SiAngular,
  fastapi: SiFastapi,
  django: SiDjango,
  flask: SiFlask,
  tailwind: SiTailwindcss,
  'tailwind css': SiTailwindcss,
  tailwindcss: SiTailwindcss,
  bootstrap: SiBootstrap,
  graphql: SiGraphql,
  nginx: SiNginx,

  // AI & Data
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  opencv: SiOpencv,

  // Databases
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mysql: SiMysql,
  mongodb: DiMongodb,
  mongo: DiMongodb,
  redis: SiRedis,
  sqlite: SiSqlite,
  firebase: SiFirebase,
  supabase: SiSupabase,

  // Tools, IDEs & DevOps (Toolstack matching my-cv)
  vscode: SiVisualstudiocode,
  'vs code': SiVisualstudiocode,
  'visual studio code': SiVisualstudiocode,
  pycharm: SiPycharm,
  jupyter: SiJupyter,
  'jupyter notebook': SiJupyter,
  postman: SiPostman,
  slack: SiSlack,
  vercel: SiVercel,
  linux: SiLinux,
  ubuntu: SiLinux,
  macos: SiMacos,
  'mac os': SiMacos,
  apple: SiMacos,
  figma: SiFigma,
  git: DiGit,
  github: SiGithub,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
  aws: SiAmazonaws,
}

export function getRawTechIcon(name: string, className = ''): React.ReactNode {
  const key = name.trim().toLowerCase()
  const IconComp = ICON_COMPONENT_MAP[key]

  if (IconComp) {
    return <IconComp className={className} />
  }

  // Graceful fallback for custom unmapped terms
  return <Code2 className={className} />
}

export default function TechIcon({
  name,
  className = '',
  mini = false,
  showLabel = true,
}: TechIconProps) {
  // If mini mode (used for selectable chip badges in admin or compact lists)
  if (mini) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        {getRawTechIcon(name, 'h-4 w-4 shrink-0')}
      </span>
    )
  }

  // Standard Portfolio Card layout: authentic 4.5em-styled icons from my-cv
  return (
    <div
      className={`group relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-blue-500/25 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 hover:border-blue-500/80 hover:bg-slate-800/80 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center text-5xl sm:text-6xl text-white transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400">
        {getRawTechIcon(name)}
      </div>

      {showLabel && (
        <span className="mt-3 text-center text-xs sm:text-sm font-semibold tracking-wide text-slate-300 transition-colors group-hover:text-white">
          {name}
        </span>
      )}
    </div>
  )
}
