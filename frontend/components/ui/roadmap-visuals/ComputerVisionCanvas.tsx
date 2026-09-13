"use client";

import React, { useEffect, useRef } from "react";

export default function ComputerVisionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scanY = 0;
    let direction = 1;

    const w = canvas.width;
    const h = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = "rgba(147, 51, 234, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Scanner laser beam
      scanY += 1.2 * direction;
      if (scanY > h || scanY < 0) direction *= -1;

      const beamGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      beamGrad.addColorStop(0, "rgba(168, 85, 247, 0)");
      beamGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.35)");
      beamGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, scanY - 20, w, 40);

      // Draw Person silhouette inside Bounding Box 1
      ctx.save();
      ctx.fillStyle = "#a855f7";
      // Head
      ctx.beginPath();
      ctx.arc(80, 42, 7, 0, Math.PI * 2);
      ctx.fill();
      // Torso
      ctx.beginPath();
      ctx.roundRect(72, 53, 16, 26, 3);
      ctx.fill();
      // Legs
      ctx.fillRect(73, 81, 6, 28);
      ctx.fillRect(81, 81, 6, 28);
      // Arms
      ctx.fillRect(66, 55, 4, 22);
      ctx.fillRect(90, 55, 4, 22);
      ctx.restore();

      // Bounding box 1: Person
      ctx.strokeStyle = "#9333ea";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 25, 80, 95);
      ctx.fillStyle = "rgba(147, 51, 234, 0.1)";
      ctx.fillRect(40, 25, 80, 95);

      ctx.fillStyle = "#9333ea";
      ctx.fillRect(40, 10, 75, 15);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.fillText("Person: 98%", 44, 21);

      // Draw Car silhouette inside Bounding Box 2
      ctx.save();
      ctx.fillStyle = "#0284c7";
      // Car body
      ctx.beginPath();
      ctx.moveTo(185, 92);
      ctx.lineTo(190, 78);
      ctx.lineTo(210, 62);
      ctx.lineTo(260, 62);
      ctx.lineTo(285, 78);
      ctx.lineTo(298, 82);
      ctx.lineTo(300, 95);
      ctx.lineTo(185, 95);
      ctx.closePath();
      ctx.fill();
      // Windows
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.beginPath();
      ctx.moveTo(214, 65);
      ctx.lineTo(256, 65);
      ctx.lineTo(275, 77);
      ctx.lineTo(198, 77);
      ctx.closePath();
      ctx.fill();
      // Wheels
      ctx.fillStyle = "#0369a1";
      ctx.beginPath();
      ctx.arc(208, 97, 8, 0, Math.PI * 2);
      ctx.arc(274, 97, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(208, 97, 3, 0, Math.PI * 2);
      ctx.arc(274, 97, 3, 0, Math.PI * 2);
      ctx.fill();
      // Headlights
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(297, 85, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bounding box 2: Vehicle
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.strokeRect(170, 40, 140, 75);
      ctx.fillStyle = "rgba(2, 132, 199, 0.08)";
      ctx.fillRect(170, 40, 140, 75);

      ctx.fillStyle = "#0284c7";
      ctx.fillRect(170, 25, 75, 15);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.fillText("Car: 99.2%", 174, 36);

      // Keypoints / Feature Tracking dots on person
      ctx.fillStyle = "#10b981";
      [[80, 42], [80, 58], [80, 81], [76, 108], [84, 108]].forEach(([kx, ky]) => {
        ctx.beginPath();
        ctx.arc(kx, ky, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-900/40 px-2 py-0.5 rounded-md">
          YOLOv11 Detection HUD
        </span>
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">120 FPS • 4K</span>
      </div>
      <canvas ref={canvasRef} width={350} height={140} className="w-full h-[140px] rounded-lg bg-slate-50 dark:bg-slate-950/50" />
    </div>
  );
}
