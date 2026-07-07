/**
 * GradientBg — devicePixelRatio-aware animated flowing gradient background
 */
import React, { useRef, useEffect } from 'react';

export const GradientBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offset = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    const draw = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.save();
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Base gradient — dark theme for white text readability
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#1a1a2e');
      bg.addColorStop(0.5, '#16213e');
      bg.addColorStop(1, '#0f3460');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Blue spotlight
      const cx1 = w * 0.25 + Math.sin(t * 0.0007) * 40 + offset.current.px;
      const cy1 = h * 0.3 + Math.cos(t * 0.0005) * 30 + offset.current.py;
      const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, Math.max(w, h) * 0.4);
      g1.addColorStop(0, 'rgba(100,149,237,0.15)');
      g1.addColorStop(1, 'rgba(100,149,237,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Purple glow
      const cx2 = w * 0.75 - Math.sin(t * 0.00055) * 35 - offset.current.px * 0.7;
      const cy2 = h * 0.65 - Math.cos(t * 0.0006) * 28 - offset.current.py * 0.7;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.max(w, h) * 0.3);
      g2.addColorStop(0, 'rgba(138,43,226,0.12)');
      g2.addColorStop(1, 'rgba(138,43,226,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Teal accent
      const cx3 = w * 0.55 + Math.cos(t * 0.00045) * 50;
      const cy3 = h * 0.5 + Math.sin(t * 0.00055) * 35;
      const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, Math.max(w, h) * 0.2);
      g3.addColorStop(0, 'rgba(72,209,204,0.1)');
      g3.addColorStop(1, 'rgba(72,209,204,0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      offset.current.px = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 20;
      offset.current.py = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 15;
    };

    resize();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ imageRendering: 'auto' }}
    />
  );
};
