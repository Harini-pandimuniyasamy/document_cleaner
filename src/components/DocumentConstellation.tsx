import React, { useEffect, useRef } from 'react';

interface ConstellationProps {
  route?: string;
  intensity?: number;
}

export const DocumentConstellation: React.FC<ConstellationProps> = ({
  route = 'dashboard',
  intensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Core Pipeline Nodes: DOCUMENT -> OCR -> STRUCTURE -> CLEAN -> FINAL
    const baseNodes = [
      { id: 'DOCUMENT', label: 'DOCUMENT', xPct: 0.12, yPct: 0.35, color: '#C65D45' },
      { id: 'OCR', label: 'OCR FIELD', xPct: 0.32, yPct: 0.22, color: '#3C8D87' },
      { id: 'STRUCTURE', label: 'STRUCTURE', xPct: 0.52, yPct: 0.38, color: '#6B315E' },
      { id: 'CLEAN', label: 'CLEANSE', xPct: 0.72, yPct: 0.25, color: '#E98268' },
      { id: 'FINAL', label: 'MATERIALIZE', xPct: 0.88, yPct: 0.42, color: '#D9A441' },
    ];

    // Branching Sub-nodes representing distant document universe
    const subNodes = [
      { parentIdx: 0, xOffset: -40, yOffset: 70, label: 'SCAN_RAW', color: '#EADCC8' },
      { parentIdx: 1, xOffset: 30, yOffset: -50, label: 'GLYPH_ARRAY', color: '#3C8D87' },
      { parentIdx: 2, xOffset: -20, yOffset: 65, label: 'SYNTAX_MATRIX', color: '#6B315E' },
      { parentIdx: 3, xOffset: 35, yOffset: 60, label: 'NOISE_PURGE', color: '#C65D45' },
      { parentIdx: 4, xOffset: -30, yOffset: -55, label: 'VERIFIED_SEAL', color: '#A8D5C2' },
    ];

    // Information signals travelling along pathways
    interface Signal {
      pathIndex: number; // between baseNodes[i] and baseNodes[i+1]
      progress: number; // 0 to 1
      speed: number;
      size: number;
      color: string;
    }

    const signals: Signal[] = [
      { pathIndex: 0, progress: 0.1, speed: 0.0035, size: 3, color: '#3C8D87' },
      { pathIndex: 1, progress: 0.5, speed: 0.004, size: 2.5, color: '#E98268' },
      { pathIndex: 2, progress: 0.8, speed: 0.003, size: 3, color: '#D9A441' },
      { pathIndex: 3, progress: 0.3, speed: 0.0045, size: 2.5, color: '#A8D5C2' },
    ];

    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      // Route adaptation: convergent coordinates if on upload or processing
      const convergenceFactor = route.includes('upload') || route.includes('processing') ? 0.3 : 1;

      const nodes = baseNodes.map((bn, i) => {
        const floatY = Math.sin(t * 0.015 + i * 1.2) * 8;
        const targetX = width * bn.xPct;
        const targetY = height * bn.yPct + floatY;

        // If converging toward center chamber:
        const cx = width * 0.5;
        const cy = height * 0.45;
        const x = cx + (targetX - cx) * (0.7 + 0.3 * convergenceFactor);
        const y = cy + (targetY - cy) * (0.7 + 0.3 * convergenceFactor);

        return { ...bn, x, y };
      });

      // 1. Draw Thin Information Pathways
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i++) {
        const n1 = nodes[i];
        const n2 = nodes[i + 1];

        // Pathway line gradient in Warm Intelligence tones
        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        grad.addColorStop(0, 'rgba(107, 49, 94, 0.22)');
        grad.addColorStop(0.5, 'rgba(60, 141, 135, 0.35)');
        grad.addColorStop(1, 'rgba(198, 93, 69, 0.22)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();

        // Secondary subtle curved tension line
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2 - 25;
        ctx.strokeStyle = 'rgba(217, 164, 65, 0.12)';
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
        ctx.stroke();
      }

      // 2. Draw Branching sub-connections
      subNodes.forEach((sn) => {
        const parent = nodes[sn.parentIdx];
        if (!parent) return;
        const sx = parent.x + sn.xOffset;
        const sy = parent.y + sn.yOffset;

        ctx.strokeStyle = 'rgba(151, 141, 145, 0.18)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Subnode dot & label
        ctx.fillStyle = 'rgba(107, 49, 94, 0.4)';
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(111, 102, 112, 0.65)';
        ctx.fillText(sn.label, sx + 5, sy + 3);
      });

      // 3. Move & Draw Information Signals
      signals.forEach((sig) => {
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          sig.progress = 0;
          sig.pathIndex = (sig.pathIndex + 1) % (nodes.length - 1);
        }

        const start = nodes[sig.pathIndex];
        const end = nodes[sig.pathIndex + 1];
        if (!start || !end) return;

        const sx = start.x + (end.x - start.x) * sig.progress;
        const sy = start.y + (end.y - start.y) * sig.progress;

        // Signal halo
        ctx.fillStyle = sig.color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(sx, sy, sig.size * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Signal core
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(sx, sy, sig.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Draw Core Pipeline Nodes
      nodes.forEach((node, i) => {
        // Outer subtle pulse ring
        const ringScale = 1 + 0.18 * Math.sin(t * 0.03 + i);
        ctx.strokeStyle = node.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 * ringScale, 0, Math.PI * 2);
        ctx.stroke();

        // Node center
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#FFF8ED';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Technical Label
        ctx.globalAlpha = 0.8;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#2C2830';
        ctx.fillText(node.label, node.x - 22, node.y - 12);
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [route, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
