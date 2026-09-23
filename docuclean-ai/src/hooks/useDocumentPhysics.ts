import { useState, useEffect, useRef } from 'react';

export interface DocumentPhysicsOptions {
  floatingSpeed?: number;
  floatingAmp?: number;
  breathingSpeed?: number;
  breathingAmp?: number;
  separationFactor?: number; // 0 = unified flat paper, 1 = exploded layers
}

export function useDocumentPhysics(options: DocumentPhysicsOptions = {}) {
  const {
    floatingSpeed = 0.0018,
    floatingAmp = 8,
    breathingSpeed = 0.0022,
    breathingAmp = 4,
    separationFactor = 0,
  } = options;

  const [physics, setPhysics] = useState({
    floatY: 0,
    floatZ: 0,
    layerSpreadZ: 0,
    edgeGlowOpacity: 0.4,
  });

  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = now - startTime;
      const floatY = Math.sin(elapsed * floatingSpeed) * floatingAmp;
      const floatZ = Math.cos(elapsed * breathingSpeed) * breathingAmp;
      const layerSpreadZ = separationFactor * 35;
      const edgeGlowOpacity = 0.35 + Math.sin(elapsed * 0.003) * 0.25;

      setPhysics({
        floatY,
        floatZ,
        layerSpreadZ,
        edgeGlowOpacity,
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [floatingSpeed, floatingAmp, breathingSpeed, breathingAmp, separationFactor]);

  return physics;
}
