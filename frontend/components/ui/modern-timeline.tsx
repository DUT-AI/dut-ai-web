"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
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
} from "./roadmap-visuals";

export interface TimelineStep {
  title: string;
  description: string;
  badge?: string;
}

interface ModernTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function ModernTimeline({ steps, className = "" }: ModernTimelineProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className={`relative w-full max-w-6xl mx-auto py-12 px-4 ${className}`}>
        {/* Central Vertical Dashed Line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px -translate-x-1/2 border-l-2 border-dashed border-blue-200 dark:border-blue-900/60 z-0" />

        <div className="flex flex-col space-y-16 md:space-y-28 relative z-10">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            const stepNumber = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <div
                key={step.title}
                className="relative flex flex-col md:flex-row items-start md:items-center w-full"
              >
                {/* Center Node Badge (Desktop) / Left Node (Mobile) */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                  <m.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4 }}
                    className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm md:text-base flex items-center justify-center shadow-lg shadow-blue-500/10 dark:shadow-none hover:scale-110 transition-transform duration-200 cursor-default"
                  >
                    {stepNumber}
                  </m.div>
                </div>

                {/* Mobile padding offset for left line */}
                <div className="w-full pl-16 md:pl-0 flex flex-col md:flex-row md:items-center">
                  {/* Left Column */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven
                        ? "md:pr-14 md:text-right flex flex-col md:items-end order-1"
                        : "md:pr-14 flex justify-start md:justify-end order-2 md:order-1 mt-6 md:mt-0"
                    }`}
                  >
                    {isEven ? (
                      /* Text Content for Even steps */
                      <m.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md"
                      >
                        <h4 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-2.5">
                          {step.title}
                        </h4>
                        <p className="text-[15px] md:text-[16px] leading-relaxed text-[#64748B] dark:text-gray-400 font-normal">
                          {step.description}
                        </p>
                      </m.div>
                    ) : (
                      /* Visual Interactive Component for Odd steps */
                      <m.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
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
                        ? "md:pl-14 flex justify-start order-2 mt-6 md:mt-0"
                        : "md:pl-14 md:text-left flex flex-col md:items-start order-1 md:order-2"
                    }`}
                  >
                    {isEven ? (
                      /* Visual Interactive Component for Even steps */
                      <m.div
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
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
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md"
                      >
                        <h4 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-2.5">
                          {step.title}
                        </h4>
                        <p className="text-[15px] md:text-[16px] leading-relaxed text-[#64748B] dark:text-gray-400 font-normal">
                          {step.description}
                        </p>
                      </m.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}

function StepVisualWidget({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <PythonVisual />;
    case 1:
      return <MathForAIVisual />;
    case 2:
      return <DataScienceMLVisual />;
    case 3:
      return <DeepLearningCanvas />;
    case 4:
      return <ComputerVisionCanvas />;
    case 5:
      return <NLPCanvas />;
    case 6:
      return <AdvancedDeepLearningCanvas />;
    case 7:
      return <AudioProcessingVisual />;
    case 8:
      return <GenerativeAICanvas />;
    case 9:
      return <LLMInteractiveVisual />;
    case 10:
      return <MLOpsVisual />;
    default:
      return null;
  }
}
