"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-orange-50 dark:bg-orange-500/10",
    blue: "bg-blue-50 dark:bg-blue-500/10",
    purple: "bg-purple-50 dark:bg-purple-500/10",
  };
  const defaultTextColors = {
    orange: "text-orange-500 dark:text-orange-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  const defaultBorderColors = {
    orange: "border-orange-100 dark:border-orange-500/20",
    blue: "border-blue-100 dark:border-blue-500/20",
    purple: "border-purple-100 dark:border-purple-500/20",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full md:w-[320px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
    >
      <div className="bg-white dark:bg-neutral-900 p-2 rounded-[25px] shadow-[0px_10px_20px_0px_#D3D3D3] dark:shadow-none border border-neutral-100 dark:border-neutral-800">
        <Pin className={`w-8 h-8 ${textColor} z-20 mb-6 mx-auto`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-[15px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-4xl font-handwriting mb-5`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 leading-none mb-[10px]">
            {title}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm/5 tracking-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[15%]", rotate: "rotate-8" },
  {
    className: "md:absolute md:top-[120px] md:right-[15%]",
    rotate: "-rotate-8",
  },
  { className: "md:absolute md:top-[450px] md:left-[15%]", rotate: "rotate-8" },
  {
    className: "md:absolute md:top-[570px] md:right-[10%]",
    rotate: "-rotate-8",
  },
  { className: "md:absolute md:top-[850px] md:left-[15%]", rotate: "rotate-8" },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Create Account",
      description:
        "Sign up in minutes. Enter your details and verify your email to get started.",
      colorTheme: "orange",
    },
    {
      title: "Verify Identity",
      description:
        "Complete your profile verification to ensure secure transactions and compliance.",
      colorTheme: "blue",
    },
    {
      title: "Select Plan",
      description:
        "Choose from a variety of investment plans tailored to your financial goals.",
      colorTheme: "purple",
    },
    {
      title: "Analyze & Invest",
      description:
        "Review returns and make your first investment with confidence.",
      colorTheme: "orange",
    },
    {
      title: "Track Growth",
      description:
        "Monitor your portfolio in real-time and watch your wealth grow over time.",
      colorTheme: "blue",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;

  // Dynamic height calculation: each step adds 225px vertical spacing
  const computedHeight = data.length <= 1 ? 400 : Math.max(400, (data.length - 1) * 225 + 400);

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`w-full relative py-6 ${className}`}
      >
        <div className="w-full mx-auto relative z-10">
          <div
            className="relative w-full max-w-[1200px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
            style={{ "--md-height": `${computedHeight}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1200 ${computedHeight}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  let pathD = "";
                  for (let i = 0; i < data.length - 1; i++) {
                    const isEven = i % 2 === 0;
                    const startX = isEven ? 340 : 860;
                    const startY = isEven ? i * 225 + 130 : i * 225 + 140;
                    const endX = isEven ? 860 : 340;
                    const endY = isEven ? (i + 1) * 225 + 140 : (i + 1) * 225 + 130;
                    const cp1X = 600;
                    const cp1Y = startY;
                    const cp2X = isEven ? 700 : 500;
                    const cp2Y = endY;

                    if (i === 0) {
                      pathD += `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
                    } else {
                      pathD += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
                    }
                  }
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-neutral-300 dark:text-neutral-700"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140, // Multiple of 14 (8+6) for seamless loop
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const isEven = index % 2 === 0;
              const defaultPositionStyle: React.CSSProperties = {
                top: `${index * 225}px`,
                left: isEven ? '5%' : undefined,
                right: !isEven ? '5%' : undefined,
              };

              const customPos = stepPositions ? stepPositions[index % stepPositions.length] : null;
              const rotate = customPos?.rotate || (isEven ? "rotate-6" : "-rotate-6");
              const positionClass = customPos?.className || "md:absolute";

              return (
                <div
                  key={step.title}
                  className={positionClass}
                  style={!customPos ? defaultPositionStyle : undefined}
                >
                  <Card
                    number={index < 9 ? `0${index + 1}` : `${index + 1}`}
                    title={step.title}
                    description={step.description}
                    colorTheme={step.colorTheme || (isEven ? "blue" : "purple")}
                    colors={step.colors}
                    rotate={rotate}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
