import React, { useEffect, useRef } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';

interface DocumentGravityFieldProps {
  activityState?: 'calm' | 'attract' | 'orbit' | 'accelerate' | 'snap';
  className?: string;
}

interface GravityParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
  alpha: number;
}

export const DocumentGravityField: React.FC<DocumentGravityFieldProps> = ({
  activityState = 'orbit',
  className = 'w-full h-full',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parallax = useMouseParallax(10, 0.05);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const centerX = width / 2;
    const centerY = height / 2;

    const colors = ['#67E8F9', '#2563EB', '#6D28D9', '#4F46E5', '#312E81'];
    const particleCount = 45;
    const particles: GravityParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const baseRadius = 140 + Math.random() * 120;
      particles.push({
        x: centerX + Math.cos(angle) * baseRadius,
        y: centerY + Math.sin(angle) * baseRadius,
        vx: 0,
        vy: 0,
        baseRadius,
        angle,
        speed: 0.006 + Math.random() * 0.008,
        color: colors[i % colors.length],
        size: 1.5 + Math.random() * 2,
        alpha: 0.35 + Math.random() * 0.5,
      });
    }

    let t = 0;
    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      const targetCenterX = width / 2 + parallax.x * 25;
      const targetCenterY = height / 2 + parallax.y * 18;

      let speedMultiplier = 1;
      let radiusMod = 1;

      if (activityState === 'accelerate') {
        speedMultiplier = 2.4;
        radiusMod = 0.85;
      } else if (activityState === 'attract') {
        speedMultiplier = 1.6;
        radiusMod = 0.7;
      } else if (activityState === 'snap') {
        speedMultiplier = 0.5;
        radiusMod = 0.4;
      } else if (activityState === 'calm') {
        speedMultiplier = 0.6;
        radiusMod = 1.1;
      }

      particles.forEach((p, idx) => {
        // Increment orbital angle
        p.angle += p.speed * speedMultiplier;

        // Current target orbital position around the document's center
        const targetX = targetCenterX + Math.cos(p.angle) * (p.baseRadius * radiusMod);
        const targetY = targetCenterY + Math.sin(p.angle) * (p.baseRadius * radiusMod * 0.85);

        // Spring-force towards orbital target
        p.vx += (targetX - p.x) * 0.04;
        p.vy += (targetY - p.y) * 0.04;

        // Damping
        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        // Draw curved gravitational vector line towards document center
        if (idx % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          // Quadratic curve bending towards document center
          const ctrlX = (p.x + targetCenterX) / 2 + Math.sin(t * 0.02 + idx) * 15;
          const ctrlY = (p.y + targetCenterY) / 2 + Math.cos(t * 0.02 + idx) * 15;
          ctx.quadraticCurveTo(ctrlX, ctrlY, targetCenterX, targetCenterY);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.15;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Draw particle head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.25;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activityState, parallax.x, parallax.y]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
