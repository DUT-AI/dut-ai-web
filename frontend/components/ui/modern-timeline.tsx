'use client'

import React from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import {
  PythonVisual,
  MathForAIVisual,
  DataScienceMLVisual,
  DeepLearningCanvas,
  ComputerVisionCanvas,
  NLPCanvas,
  AdvancedDeepLearningCanvas,
  AudioProcessingVisual,
  GenerativeAICanvas,
  LLMInteractiveVisual,
  MLOpsVisual,
} from './roadmap-visuals'

export interface TimelineStep {
  title: string
  description: string
  badge?: string
}

interface ModernTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export default function ModernTimeline({ steps, className = '' }: ModernTimelineProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className={`relative mx-auto w-full max-w-6xl px-4 py-12 ${className}`}>
        {/* Central Vertical Dashed Line */}
        <div className="absolute top-4 bottom-4 left-6 z-0 w-px -translate-x-1/2 border-l-2 border-dashed border-blue-200 md:left-1/2 dark:border-blue-900/60" />

        <div className="relative z-10 flex flex-col space-y-16 md:space-y-28">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0
            const stepNumber = idx < 9 ? `0${idx + 1}` : `${idx + 1}`

            return (
              <div
                key={step.title}
                className="relative flex w-full flex-col items-start md:flex-row md:items-center"
              >
                {/* Center Node Badge (Desktop) / Left Node (Mobile) */}
                <div className="absolute left-6 z-20 flex -translate-x-1/2 items-center justify-center md:left-1/2">
                  <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4 }}
                    className="flex h-12 w-12 cursor-default items-center justify-center rounded-full border-2 border-blue-500 bg-white text-sm font-bold text-blue-600 shadow-lg shadow-blue-500/10 transition-transform duration-200 hover:scale-110 md:text-base dark:bg-gray-900 dark:text-blue-400 dark:shadow-none"
                  >
                    {stepNumber}
                  </m.div>
                </div>

                {/* Mobile padding offset for left line */}
                <div className="flex w-full flex-col pl-16 md:flex-row md:items-center md:pl-0">
                  {/* Left Column */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven
                        ? 'order-1 flex flex-col md:items-end md:pr-14 md:text-right'
                        : 'order-2 mt-6 flex justify-start md:order-1 md:mt-0 md:justify-end md:pr-14'
                    }`}
                  >
                    {isEven ? (
                      /* Text Content for Even steps */
                      <m.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md"
                      >
                        <h4 className="mb-2.5 text-2xl font-extrabold tracking-tight text-[#1E293B] md:text-3xl dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-[15px] leading-relaxed font-normal text-[#64748B] md:text-[16px] dark:text-gray-400">
                          {step.description}
                        </p>
                      </m.div>
                    ) : (
                      /* Visual Interactive Component for Odd steps */
                      <m.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                      >
                        <StepVisualWidget index={idx} />
                      </m.div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven
                        ? 'order-2 mt-6 flex justify-start md:mt-0 md:pl-14'
                        : 'order-1 flex flex-col md:order-2 md:items-start md:pl-14 md:text-left'
                    }`}
                  >
                    {isEven ? (
                      /* Visual Interactive Component for Even steps */
                      <m.div
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                      >
                        <StepVisualWidget index={idx} />
                      </m.div>
                    ) : (
                      /* Text Content for Odd steps */
                      <m.div
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md"
                      >
                        <h4 className="mb-2.5 text-2xl font-extrabold tracking-tight text-[#1E293B] md:text-3xl dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-[15px] leading-relaxed font-normal text-[#64748B] md:text-[16px] dark:text-gray-400">
                          {step.description}
                        </p>
                      </m.div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </LazyMotion>
  )
}

function StepVisualWidget({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <PythonVisual />
    case 1:
      return <MathForAIVisual />
    case 2:
      return <DataScienceMLVisual />
    case 3:
      return <DeepLearningCanvas />
    case 4:
      return <ComputerVisionCanvas />
    case 5:
      return <NLPCanvas />
    case 6:
      return <AdvancedDeepLearningCanvas />
    case 7:
      return <AudioProcessingVisual />
    case 8:
      return <GenerativeAICanvas />
    case 9:
      return <LLMInteractiveVisual />
    case 10:
      return <MLOpsVisual />
    default:
      return null
  }
}
