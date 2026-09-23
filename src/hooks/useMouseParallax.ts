import { useState, useEffect, useRef } from 'react';

export interface ParallaxState {
  x: number; // -1 to 1
  y: number; // -1 to 1
  rotateX: number; // deg
  rotateY: number; // deg
  tiltX: number;
  tiltY: number;
  isHovered: boolean;
}

export function useMouseParallax(maxTiltDeg: number = 12, smoothing: number = 0.08) {
  const [state, setState] = useState<ParallaxState>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    tiltX: 0,
    tiltY: 0,
    isHovered: false,
  });

  const targetRef = useRef({ x: 0, y: 0, isHovered: false });
  const currentRef = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Relative to window
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      targetRef.current = {
        x: normX,
        y: normY,
        isHovered: true,
      };
    };

    const handleMouseLeave = () => {
      targetRef.current = {
        x: 0,
        y: 0,
        isHovered: false,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const updateLoop = () => {
      // Smooth lerp
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothing;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothing;

      const rotY = currentRef.current.x * maxTiltDeg;
      const rotX = -currentRef.current.y * maxTiltDeg;

      setState({
        x: currentRef.current.x,
        y: currentRef.current.y,
        rotateX: rotX,
        rotateY: rotY,
        tiltX: -rotY,
        tiltY: rotX,
        isHovered: targetRef.current.isHovered,
      });

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [maxTiltDeg, smoothing]);

  return state;
}
