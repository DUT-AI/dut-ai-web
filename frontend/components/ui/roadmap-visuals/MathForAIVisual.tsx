"use client";

import React, { useEffect, useRef } from "react";

export default function MathForAIVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Coordinate axes
      ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, h - 25);
      ctx.lineTo(w - 20, h - 25);
      ctx.moveTo(30, 20);
      ctx.lineTo(30, h - 25);
      ctx.stroke();

      // Draw convex loss curve
      ctx.beginPath();
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2.5;

      for (let x = 30; x < w - 20; x++) {
        const normX = (x - 30) / (w - 50); // 0 to 1
        // Parabolic loss + gentle sine harmonic
        const loss = Math.pow(normX - 0.5, 2) * 4 + 0.15 * Math.sin(normX * 6 + t * 0.5);
        const y = h - 35 - loss * (h - 70);

        if (x === 30) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Descent ball moving toward minimum
      const ballNormX = 0.5 + 0.35 * Math.cos(t);
      const ballLoss = Math.pow(ballNormX - 0.5, 2) * 4 + 0.15 * Math.sin(ballNormX * 6 + t * 0.5);
      const ballX = 30 + ballNormX * (w - 50);
      const ballY = h - 35 - ballLoss * (h - 70);

      // Glow
      const grad = ctx.createRadialGradient(ballX, ballY, 1, ballX, ballY, 12);
      grad.addColorStop(0, "rgba(236, 72, 153, 1)");
      grad.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Solid center
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/40 p-4 shadow-[0_10px_30px_rgb(0,0,0,0.05)] text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md">
            ∇f(θ) Optimizer
          </span>
          <span className="text-[11px] text-gray-500 font-serif italic">Gradient Descent</span>
        </div>
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
          lr = 0.001
        </span>
      </div>
      <canvas ref={canvasRef} width={340} height={130} className="w-full h-[130px] rounded-lg" />
    </div>
  );
}
