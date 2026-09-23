import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DocumentConstellation } from './DocumentConstellation';
import { AIPulse } from './AIPulse';

interface DigitalEnvironmentProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const DigitalEnvironment: React.FC<DigitalEnvironmentProps> = ({
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const location = useLocation();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse Parallax listener with smooth interpolation
  useEffect(() => {
    let animId: number;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateMouse = () => {
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
      animId = requestAnimationFrame(updateMouse);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Route-specific settings
    const path = location.pathname;
    const isProcessing = path.includes('processing');
    const isUpload = path.includes('upload');
    const isPreview = path.includes('preview');
    const isSuccess = path.includes('success');

    // 1. FAR DEPTH: Large translucent document silhouettes (thousands far away)
    const farDocs = [
      { x: width * 0.08, y: height * 0.15, rot: -0.12, w: 280, h: 380, speed: 0.00015, alpha: 0.06 },
      { x: width * 0.88, y: height * 0.25, rot: 0.14, w: 320, h: 420, speed: 0.0002, alpha: 0.05 },
      { x: width * 0.15, y: height * 0.85, rot: -0.06, w: 260, h: 360, speed: 0.00018, alpha: 0.045 },
      { x: width * 0.85, y: height * 0.82, rot: 0.18, w: 300, h: 400, speed: 0.00012, alpha: 0.055 },
      { x: width * 0.5, y: height * -0.05, rot: 0.04, w: 360, h: 460, speed: 0.0001, alpha: 0.035 },
    ];

    // 2. MID DEPTH: OCR wireframes, document outlines, structural diagrams, information nodes
    const midStructures: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      label: string;
      alpha: number;
      pulseRate: number;
      kind: 'box' | 'diagram' | 'matrix';
    }> = [
      { x: width * 0.05, y: height * 0.45, w: 140, h: 80, label: 'OCR_SEGMENT [0x1A]', alpha: 0.14, pulseRate: 0.002, kind: 'box' },
      { x: width * 0.82, y: height * 0.5, w: 160, h: 95, label: 'SYNTAX_MATRIX [4×4]', alpha: 0.12, pulseRate: 0.0025, kind: 'matrix' },
      { x: width * 0.22, y: height * 0.1, w: 180, h: 70, label: 'LEXICAL_LAYER [3]', alpha: 0.11, pulseRate: 0.0018, kind: 'diagram' },
      { x: width * 0.75, y: height * 0.12, w: 130, h: 65, label: 'ALIGNMENT_VECTOR', alpha: 0.13, pulseRate: 0.0022, kind: 'box' },
      { x: width * 0.18, y: height * 0.72, w: 150, h: 85, label: 'NOISE_FILTER_GRID', alpha: 0.12, pulseRate: 0.0021, kind: 'matrix' },
    ];

    // 3. NEAR DEPTH: Tiny text fragments, OCR symbols, document particles, data points, micro labels
    const nearTokens = [
      { text: '§ 14.2', x: width * 0.25, y: height * 0.3, vx: 0.15, vy: -0.1, color: '#3C8D87' },
      { text: 'ALIGN_0.0°', x: width * 0.72, y: height * 0.38, vx: -0.12, vy: -0.08, color: '#C65D45' },
      { text: 'UTF-8', x: width * 0.38, y: height * 0.78, vx: 0.1, vy: -0.12, color: '#6B315E' },
      { text: '99.4%', x: width * 0.65, y: height * 0.75, vx: -0.08, vy: -0.14, color: '#D9A441' },
      { text: 'KERNING: OK', x: width * 0.12, y: height * 0.62, vx: 0.12, vy: -0.09, color: '#3C8D87' },
    ];

    // Micro document particles in Warm Intelligence tones
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }> = [];

    const particleColors = ['#C65D45', '#3C8D87', '#6B315E', '#D9A441', '#EADCC8'];
    const pCount = isProcessing ? 45 : isSuccess ? 18 : 28;
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.25,
        color: particleColors[i % particleColors.length],
        alpha: 0.2 + Math.random() * 0.35,
      });
    }

    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Parallax Speed tiers
      // FAR: extremely subtle
      const farX = mx * 8;
      const farY = my * 6;
      // MID: moderate
      const midX = mx * 22;
      const midY = my * 16;
      // NEAR: slightly stronger
      const nearX = mx * 45;
      const nearY = my * 32;

      // ==============================================================
      // 1. FAR DEPTH: Large translucent document silhouettes
      // ==============================================================
      farDocs.forEach((doc, idx) => {
        const curX = doc.x + farX;
        const curY = doc.y + Math.sin(t * doc.speed * 12 + idx) * 12 + farY;
        const curRot = doc.rot + Math.sin(t * 0.0004 + idx) * 0.03;

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(curRot);

        // Document Paper Body in Deep Plum / Mulberry silhouette
        ctx.fillStyle = `rgba(36, 22, 47, ${doc.alpha})`;
        ctx.strokeStyle = `rgba(107, 49, 94, ${doc.alpha * 1.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-doc.w / 2, -doc.h / 2, doc.w, doc.h, 12);
        ctx.fill();
        ctx.stroke();

        // Ghost text lines inside distant documents
        ctx.fillStyle = `rgba(107, 49, 94, ${doc.alpha * 0.9})`;
        for (let row = 0; row < 7; row++) {
          ctx.fillRect(-doc.w / 2 + 24, -doc.h / 2 + 35 + row * 22, doc.w * 0.72, 3);
        }

        ctx.restore();
      });

      // ==============================================================
      // 2. MID DEPTH: OCR wireframes & structural diagrams
      // ==============================================================
      midStructures.forEach((struct, idx) => {
        const sx = struct.x + midX;
        const sy = struct.y + midY + Math.sin(t * struct.pulseRate * 8 + idx) * 8;
        const pulse = 0.6 + 0.4 * Math.sin(t * struct.pulseRate * 12 + idx);

        ctx.save();
        ctx.strokeStyle = `rgba(60, 141, 135, ${struct.alpha * pulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(sx, sy, struct.w, struct.h);
        ctx.setLineDash([]);

        // Small corner brackets
        ctx.strokeStyle = `rgba(198, 93, 69, ${struct.alpha * 2 * pulse})`;
        const cornerLen = 8;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(sx, sy + cornerLen);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx + cornerLen, sy);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(sx + struct.w - cornerLen, sy + struct.h);
        ctx.lineTo(sx + struct.w, sy + struct.h);
        ctx.lineTo(sx + struct.w, sy + struct.h - cornerLen);
        ctx.stroke();

        // Technical Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(111, 102, 112, ${struct.alpha * 3.5 * pulse})`;
        ctx.fillText(struct.label, sx + 6, sy - 5);

        // If matrix kind, draw mini subgrid
        if (struct.kind === 'matrix') {
          ctx.strokeStyle = `rgba(107, 49, 94, ${struct.alpha * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy + struct.h / 2);
          ctx.lineTo(sx + struct.w, sy + struct.h / 2);
          ctx.moveTo(sx + struct.w / 2, sy);
          ctx.lineTo(sx + struct.w / 2, sy + struct.h);
          ctx.stroke();
        }

        ctx.restore();
      });

      // ==============================================================
      // 3. NEAR DEPTH: Micro text fragments & data points
      // ==============================================================
      nearTokens.forEach((tok) => {
        tok.x += tok.vx;
        tok.y += tok.vy;
        if (tok.y < -20) tok.y = height + 20;
        if (tok.x < -30) tok.x = width + 30;
        if (tok.x > width + 30) tok.x = -30;

        const tx = tok.x + nearX;
        const ty = tok.y + nearY;

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = tok.color;
        ctx.globalAlpha = 0.45;
        ctx.fillText(tok.text, tx, ty);
        ctx.globalAlpha = 1;
      });

      // Near Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const px = p.x + nearX;
        const py = p.y + nearY;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [location.pathname, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#FFF8ED]">
      {/* 1. Warm Intelligence Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8ED] via-[#F8EFE3] to-[#F3E7D5]/80" />

      {/* Atmospheric Soft Light Orbs (Mulberry, Terracotta, Soft Teal) */}
      <div
        className="absolute -top-36 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6B315E 0%, #C65D45 40%, transparent 80%)',
          transform: `translate3d(${mouseRef.current.x * 12}px, ${mouseRef.current.y * 10}px, 0)`,
        }}
      />
      <div
        className="absolute top-1/2 -right-32 w-[650px] h-[650px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3C8D87 0%, #D9A441 50%, transparent 80%)',
          transform: `translate3d(${mouseRef.current.x * -16}px, ${mouseRef.current.y * -14}px, 0)`,
        }}
      />

      {/* 2. Living Canvas: Far Silhouettes, Mid Structures, Near Tokens */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 3. Document Constellation Pathways */}
      <DocumentConstellation route={location.pathname} />

      {/* 4. Elegant AI Pulse Sequence */}
      <AIPulse intervalMs={7000} active={true} />
    </div>
  );
};
