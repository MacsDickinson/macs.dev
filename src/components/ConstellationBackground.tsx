import React, { useEffect, useRef } from 'react';
type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  hue: number; // 0 dim, 1 electric, 2 signal
};
const HUES = ['#8a93a6', '#6c5ce7', '#00b894'];
type ConstellationBackgroundProps = {
  className?: string;
};
/**
 * Cursor-reactive particle constellation rendered on a <canvas>.
 * Points drift, connect by proximity, and ease toward the cursor
 * (which also brightens nearby links in the accent colour).
 * Falls back to a gentle auto-drift when reduced-motion is preferred
 * or on touch devices (no cursor dependency).
 */
export function ConstellationBackground({
  className
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    active: false
  });
  const sizeRef = useRef<{
    w: number;
    h: number;
    dpr: number;
  }>({
    w: 0,
    h: 0,
    dpr: 1
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK_DIST = 130;
    const MOUSE_DIST = 200;
    const seed = () => {
      const { w, h } = sizeRef.current;
      // Density scales with area but is capped for performance.
      const count = Math.min(120, Math.max(40, Math.round(w * h / 16000)));
      const pts: Point[] = [];
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseR: Math.random() * 1.6 + 0.8,
          hue: Math.random() < 0.16 ? 1 : Math.random() < 0.28 ? 2 : 0
        });
      }
      pointsRef.current = pts;
    };
    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = {
        w,
        h,
        dpr
      };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const draw = () => {
      const { w, h } = sizeRef.current;
      const pts = pointsRef.current;
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Cursor gravity — points ease gently toward the pointer.
        if (mouse.active && !reduced) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST && dist > 0.01) {
            const pull = (1 - dist / MOUSE_DIST) * 0.4;
            p.vx += dx / dist * pull * 0.06;
            p.vy += dy / dist * pull * 0.06;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        // Friction + wrap around edges.
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      // Links.
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const nearMouse =
            mouse.active &&
            Math.hypot(mouse.x - midX, mouse.y - midY) < MOUSE_DIST;
            const base = 1 - dist / LINK_DIST;
            if (nearMouse) {
              ctx.strokeStyle = `rgba(255, 90, 44, ${base * 0.55})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(138, 147, 166, ${base * 0.22})`;
              ctx.lineWidth = 0.6;
            }
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // Points.
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const near =
        mouse.active && Math.hypot(mouse.x - p.x, mouse.y - p.y) < MOUSE_DIST;
        ctx.beginPath();
        ctx.fillStyle = near ? '#ff5a2c' : HUES[p.hue];
        ctx.globalAlpha = near ? 0.95 : 0.7;
        ctx.arc(p.x, p.y, p.baseR + (near ? 0.8 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: e.pointerType !== 'touch'
      };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}