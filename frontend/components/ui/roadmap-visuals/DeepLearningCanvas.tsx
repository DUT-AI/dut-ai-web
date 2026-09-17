"use client";

import React, { useEffect, useRef } from "react";

export default function DeepLearningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const layers = [3, 4, 4, 2];
    const w = canvas.width;
    const h = canvas.height;

    // Node coordinates
    const nodes: { x: number; y: number; layer: number }[] = [];
    const layerSpacing = (w - 60) / (layers.length - 1);

    layers.forEach((count, lIdx) => {
      const x = 30 + lIdx * layerSpacing;
      const nodeSpacing = (h - 40) / (count + 1);
      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = 20 + (nIdx + 1) * nodeSpacing;
        nodes.push({ x, y, layer: lIdx });
      }
    });

    const render = () => {
      t += 0.04;
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].layer === nodes[i].layer + 1) {
            ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Synapse firing particles
            const pulse = (t + i * 0.3 + j * 0.2) % 1;
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulse;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulse;

            ctx.fillStyle = "#3b82f6";
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, idx) => {
        const pulse = Math.sin(t * 2 + idx) * 0.2 + 0.8;
        ctx.fillStyle = node.layer === 0 ? "#2563eb" : node.layer === 3 ? "#059669" : "#7c3aed";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl text-left transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Multi-Layer Perceptron
        </span>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">epoch 100/100</span>
      </div>
      <canvas ref={canvasRef} width={360} height={140} className="w-full h-[140px] rounded-lg bg-slate-50 dark:bg-slate-950/50" />
    </div>
  );
}
