import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type CharacterAction =
  | 'idle'
  | 'upload'
  | 'file_detected'
  | 'receiving'
  | 'carrying_document'
  | 'inserting_chamber'
  | 'scanning'
  | 'scanning_beam'
  | 'worker_reading'
  | 'analyzing'
  | 'worker_analyzing'
  | 'cleaning'
  | 'worker_cleaning'
  | 'worker_normalizing'
  | 'worker_reconstructing'
  | 'before_after'
  | 'comparing'
  | 'success'
  | 'complete'
  | 'celebrating'
  | 'download'
  | 'downloading'
  | 'error'
  | 'warning'
  | 'inspecting';

interface AICharacterProps {
  action?: CharacterAction;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  hasDocument?: boolean;
  documentName?: string;
  onAnimationEnd?: () => void;
  interactive?: boolean;
  showStatusBadge?: boolean;
  statusLabel?: string;
  onClick?: () => void;
}

export const AICharacter: React.FC<AICharacterProps> = ({
  action = 'idle',
  size = 'md',
  className = '',
  hasDocument = false,
  documentName,
  interactive = true,
  showStatusBadge = true,
  statusLabel,
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef(action);
  actionRef.current = action;

  const [interactivePulse, setInteractivePulse] = useState(false);

  const sizePixels =
    size === 'xs'
      ? { w: 100, h: 110 }
      : size === 'sm'
      ? { w: 140, h: 160 }
      : size === 'lg'
      ? { w: 260, h: 290 }
      : { w: 200, h: 230 };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, sizePixels.w / sizePixels.h, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(sizePixels.w, sizePixels.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting (Warm Intelligence Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xfff8ed, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe98268, 1.8); // Coral key
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3c8d87, 1.3); // Teal rim
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const topLight = new THREE.DirectionalLight(0xd9a441, 0.8); // Amber top
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    // 4. Character Robot Group (DocuBot)
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Materials
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xfff8ed,
      roughness: 0.22,
      metalness: 0.12,
    });
    const darkPlumMat = new THREE.MeshStandardMaterial({
      color: 0x24162f,
      roughness: 0.3,
      metalness: 0.6,
    });
    const mulberryTrimMat = new THREE.MeshStandardMaterial({
      color: 0x6b315e,
      roughness: 0.3,
      metalness: 0.3,
    });
    const tealVisorMat = new THREE.MeshBasicMaterial({
      color: 0x3c8d87,
    });
    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
    });
    const amberCoreMat = new THREE.MeshStandardMaterial({
      color: 0xd9a441,
      roughness: 0.2,
      emissive: 0xd9a441,
      emissiveIntensity: 0.4,
    });

    // Torso (Sleek aerodynamic collectible capsule)
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.52, 24);
    const torso = new THREE.Mesh(torsoGeo, ceramicMat);
    torso.position.y = -0.15;
    robotGroup.add(torso);

    // Torso Accent Collar (Mulberry)
    const collarGeo = new THREE.TorusGeometry(0.33, 0.035, 16, 32);
    const collar = new THREE.Mesh(collarGeo, mulberryTrimMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.12;
    torso.add(collar);

    // Chest Core Crystal (Amber / Mint energy reactor)
    const reactorGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const reactor = new THREE.Mesh(reactorGeo, amberCoreMat);
    reactor.position.set(0, -0.02, 0.26);
    torso.add(reactor);

    // Head Group (Floating independently with natural micro-lag)
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.48;
    robotGroup.add(headGroup);

    // Head Shell (Egg-like rounded geometry)
    const headGeo = new THREE.SphereGeometry(0.38, 28, 28);
    const head = new THREE.Mesh(headGeo, ceramicMat);
    head.scale.set(1.05, 0.95, 1);
    headGroup.add(head);

    // Visor Glass Face (Dark Plum Curved Lens)
    const visorGeo = new THREE.SphereGeometry(0.34, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const visor = new THREE.Mesh(visorGeo, darkPlumMat);
    visor.rotation.x = Math.PI / 2.1;
    visor.position.set(0, 0.03, 0.12);
    visor.scale.set(0.9, 0.9, 0.9);
    headGroup.add(visor);

    // Expressive Digital Eyes (Two glowing cylinders with dynamic scaling)
    const eyeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.1, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    leftEye.rotation.z = Math.PI / 2;
    leftEye.position.set(-0.11, 0.05, 0.35);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    rightEye.rotation.z = Math.PI / 2;
    rightEye.position.set(0.11, 0.05, 0.35);
    headGroup.add(rightEye);

    // Halo Antenna / Information Sensor Ring
    const haloGeo = new THREE.TorusGeometry(0.2, 0.015, 12, 32);
    const halo = new THREE.Mesh(haloGeo, tealVisorMat);
    halo.rotation.x = Math.PI / 2.4;
    halo.position.set(0, 0.45, -0.05);
    headGroup.add(halo);

    // Floating Magnetic Left Hand
    const handGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftHand = new THREE.Mesh(handGeo, ceramicMat);
    leftHand.position.set(-0.52, -0.15, 0.1);
    robotGroup.add(leftHand);

    // Floating Magnetic Right Hand
    const rightHand = new THREE.Mesh(handGeo, ceramicMat);
    rightHand.position.set(0.52, -0.15, 0.1);
    robotGroup.add(rightHand);

    // Mini Document Prop (Held when file is detected, uploaded, or downloading)
    const docPropGeo = new THREE.BoxGeometry(0.36, 0.48, 0.02);
    const docPropMat = new THREE.MeshStandardMaterial({
      color: 0xfff8ed,
      roughness: 0.35,
      emissive: 0xc65d45,
      emissiveIntensity: 0.15,
    });
    const docProp = new THREE.Mesh(docPropGeo, docPropMat);
    docProp.position.set(0, -0.12, 0.36);
    docProp.visible = false;
    robotGroup.add(docProp);

    // Digital Energy Collector Cylinder (used during cleaning stage)
    const capsuleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16);
    const capsuleMat = new THREE.MeshStandardMaterial({
      color: 0xd9a441,
      roughness: 0.15,
      emissive: 0x3c8d87,
      emissiveIntensity: 0.6,
    });
    const collectorCapsule = new THREE.Mesh(capsuleGeo, capsuleMat);
    collectorCapsule.position.set(0.38, 0.05, 0.32);
    collectorCapsule.visible = false;
    robotGroup.add(collectorCapsule);

    // Scanning Light Fan Beam (subtle volumetric light plane that sweeps down)
    const beamGeo = new THREE.ConeGeometry(0.6, 0.9, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x3c8d87,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const scanBeam = new THREE.Mesh(beamGeo, beamMat);
    scanBeam.rotation.x = Math.PI;
    scanBeam.position.set(0, -0.3, 0.3);
    scanBeam.visible = false;
    robotGroup.add(scanBeam);

    // Subtle OCR / Data Dust Particles (35 orbiting micro-particles)
    const particleCount = 35;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.4;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    robotGroup.add(particles);

    // Mouse Tracking setup
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const curAction = actionRef.current;

      // 1. Idle Hovering Physics
      const hoverY = Math.sin(elapsed * 2.2) * 0.08;
      const hoverRotZ = Math.sin(elapsed * 1.4) * 0.04;
      robotGroup.position.y = hoverY;
      robotGroup.rotation.z = hoverRotZ;

      // 2. Halo gentle spin
      halo.rotation.z = elapsed * 1.2;

      // 3. Ambient Particle Orbiting
      particles.rotation.y = elapsed * 0.4;

      // 4. Head Cursor Tracking (curious looking around with natural clamp)
      const targetHeadYaw = mouseX * 0.4;
      const targetHeadPitch = -mouseY * 0.3;
      headGroup.rotation.y += (targetHeadYaw - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetHeadPitch - headGroup.rotation.x) * 0.08;

      // 5. Natural Eye Blinking Cycle
      const blinkCycle = Math.sin(elapsed * 1.6);
      const eyeBlinkScale = blinkCycle > 0.94 ? 0.15 : 1;

      // 6. Comprehensive STATE-BASED BEHAVIOR ENGINE
      switch (curAction) {
        // STATE 1: IDLE / OBSERVING
        case 'idle':
        default: {
          docProp.visible = false;
          collectorCapsule.visible = false;
          scanBeam.visible = false;
          particleMat.color.setHex(0x67e8f9);
          particleMat.opacity = 0.5;

          // Hands at gentle resting positions
          leftHand.position.set(-0.48 + Math.sin(elapsed * 2) * 0.03, -0.15 + hoverY * 0.5, 0.1);
          rightHand.position.set(0.48 - Math.sin(elapsed * 2) * 0.03, -0.15 + hoverY * 0.5, 0.1);

          // Soft teal intelligent eyes
          eyeGlowMat.color.setHex(0x67e8f9);
          amberCoreMat.emissive.setHex(0xd9a441);
          amberCoreMat.emissiveIntensity = 0.3 + Math.sin(elapsed * 3) * 0.15;

          leftEye.scale.set(1, eyeBlinkScale, 1);
          rightEye.scale.set(1, eyeBlinkScale, 1);
          break;
        }

        // STATE 2: UPLOAD / FILE DETECTED / RECEIVING
        case 'upload':
        case 'file_detected':
        case 'receiving':
        case 'carrying_document':
        case 'inserting_chamber': {
          docProp.visible = true;
          collectorCapsule.visible = false;
          scanBeam.visible = false;

          // Reaching arms forward to receive & steady document
          const docHover = Math.sin(elapsed * 3.5) * 0.03;
          docProp.position.set(0, -0.1 + docHover, 0.36);
          docProp.rotation.y = Math.sin(elapsed * 2.5) * 0.06;

          leftHand.position.set(-0.25, -0.12 + docHover, 0.37);
          rightHand.position.set(0.25, -0.12 + docHover, 0.37);

          // Head looks down attentively at document
          headGroup.rotation.x = 0.18;

          // Warm Amber alert eyes
          eyeGlowMat.color.setHex(0xd9a441);
          amberCoreMat.emissive.setHex(0xd9a441);
          amberCoreMat.emissiveIntensity = 0.7;

          leftEye.scale.set(1.15, 1.15 * eyeBlinkScale, 1);
          rightEye.scale.set(1.15, 1.15 * eyeBlinkScale, 1);
          break;
        }

        // STATE 3: DOCUMENT SCANNING STATE
        case 'scanning':
        case 'scanning_beam':
        case 'worker_reading': {
          docProp.visible = false;
          collectorCapsule.visible = false;
          scanBeam.visible = true;

          // Sweeping scanning beam
          const sweep = Math.sin(elapsed * 4);
          scanBeam.position.x = sweep * 0.18;
          scanBeam.rotation.z = sweep * 0.2;
          beamMat.opacity = 0.35 + Math.sin(elapsed * 8) * 0.1;

          // Particle dust accelerates and focuses
          particles.rotation.y = elapsed * 1.5;
          particleMat.color.setHex(0x3c8d87);
          particleMat.opacity = 0.85;

          // Eyes sweep synchronously with the scan beam
          eyeGlowMat.color.setHex(0x22d3ee); // Laser Cyan
          headGroup.rotation.y = sweep * 0.25;
          headGroup.rotation.x = 0.15;

          leftHand.position.set(-0.35, 0.05, 0.25);
          rightHand.position.set(0.35, 0.05, 0.25);

          leftEye.scale.set(1.2, 0.7, 1); // Focused scan slit eyes
          rightEye.scale.set(1.2, 0.7, 1);
          break;
        }

        // STATE 4: ANALYZING STATE
        case 'analyzing':
        case 'worker_analyzing':
        case 'inspecting': {
          docProp.visible = false;
          collectorCapsule.visible = false;
          scanBeam.visible = false;

          // Curious tilted head evaluating syntax & OCR metrics
          headGroup.rotation.z = 0.14 + Math.sin(elapsed * 2) * 0.05;
          headGroup.rotation.x = -0.05;

          // One hand up in thoughtful contemplation
          leftHand.position.set(-0.36, 0.18 + Math.sin(elapsed * 3) * 0.03, 0.22);
          rightHand.position.set(0.38, -0.15, 0.18);

          // Coral thinking eyes
          eyeGlowMat.color.setHex(0xe98268);
          amberCoreMat.emissive.setHex(0xe98268);
          amberCoreMat.emissiveIntensity = 0.6;

          leftEye.scale.set(1, eyeBlinkScale, 1);
          rightEye.scale.set(1, eyeBlinkScale, 1);
          break;
        }

        // STATE 5: CLEANING STATE (Most visually satisfying active work)
        case 'cleaning':
        case 'worker_cleaning':
        case 'worker_normalizing':
        case 'worker_reconstructing': {
          collectorCapsule.visible = true;
          docProp.visible = false;
          scanBeam.visible = true;

          // Rapid particle vortex drawing unwanted fragments
          particles.rotation.y = elapsed * 2.8;
          particleMat.color.setHex(0xc65d45);

          // Active mechanical hands drawing artifacts
          collectorCapsule.rotation.y = elapsed * 6;
          rightHand.position.set(0.38, 0.06 + Math.sin(elapsed * 5) * 0.05, 0.32);
          leftHand.position.set(-0.34 + Math.sin(elapsed * 4) * 0.08, 0.1, 0.22);

          // Dynamic scanning cone
          scanBeam.position.y = -0.25 + Math.sin(elapsed * 3) * 0.08;
          beamMat.color.setHex(0xc65d45);
          beamMat.opacity = 0.3;

          // Terracotta focused worker eyes
          eyeGlowMat.color.setHex(0xc65d45);
          amberCoreMat.emissive.setHex(0xc65d45);
          amberCoreMat.emissiveIntensity = 0.85;

          leftEye.scale.set(1.25, 0.85, 1);
          rightEye.scale.set(1.25, 0.85, 1);
          break;
        }

        // STATE 6: BEFORE / AFTER COMPARISON STATE
        case 'before_after':
        case 'comparing': {
          docProp.visible = false;
          collectorCapsule.visible = false;
          scanBeam.visible = false;

          // Head shifts from looking left (before) to right (after)
          const lookCycle = Math.sin(elapsed * 1.8);
          headGroup.rotation.y = lookCycle * 0.35;
          headGroup.rotation.x = 0.05;

          // Hands point comparatively
          leftHand.position.set(-0.45, -0.05, 0.25);
          rightHand.position.set(0.45, 0.05, 0.25);

          // Soft Mint approval eyes
          eyeGlowMat.color.setHex(0xa8d5c2);
          amberCoreMat.emissive.setHex(0x3c8d87);
          amberCoreMat.emissiveIntensity = 0.5;

          leftEye.scale.set(1.1, eyeBlinkScale, 1);
          rightEye.scale.set(1.1, eyeBlinkScale, 1);
          break;
        }

        // STATE 7: CLEANING SUCCESS / CELEBRATION
        case 'success':
        case 'complete':
        case 'celebrating': {
          collectorCapsule.visible = false;
          docProp.visible = false;
          scanBeam.visible = false;

          // Upbeat celebratory bounce
          const bounce = Math.abs(Math.sin(elapsed * 5)) * 0.12;
          robotGroup.position.y = hoverY + bounce;
          robotGroup.rotation.y = Math.sin(elapsed * 3) * 0.2;

          // Hand wave & thumbs-up gesture
          rightHand.position.set(0.42, 0.28 + Math.sin(elapsed * 6) * 0.06, 0.22);
          leftHand.position.set(-0.4, -0.05, 0.2);

          // Joyous emerald eyes
          eyeGlowMat.color.setHex(0x34d399);
          amberCoreMat.emissive.setHex(0x34d399);
          amberCoreMat.emissiveIntensity = 0.9;

          // Cheerful smiling crescent scale
          leftEye.scale.set(1.2, 0.9, 1);
          rightEye.scale.set(1.2, 0.9, 1);
          break;
        }

        // STATE 8: DOWNLOAD STATE
        case 'download':
        case 'downloading': {
          docProp.visible = true;
          collectorCapsule.visible = false;
          scanBeam.visible = false;

          // Offers document forward presenting to user
          const presentY = -0.08 + Math.sin(elapsed * 2.5) * 0.03;
          docProp.position.set(0, presentY, 0.42);
          leftHand.position.set(-0.24, presentY - 0.02, 0.43);
          rightHand.position.set(0.24, presentY - 0.02, 0.43);

          headGroup.rotation.x = 0.12;

          // Warm Gold download glow
          eyeGlowMat.color.setHex(0xfbbf24);
          amberCoreMat.emissive.setHex(0xfbbf24);
          amberCoreMat.emissiveIntensity = 0.8;

          leftEye.scale.set(1.1, eyeBlinkScale, 1);
          rightEye.scale.set(1.1, eyeBlinkScale, 1);
          break;
        }

        // STATE 9: ERROR / WARNING STATE
        case 'error':
        case 'warning': {
          docProp.visible = false;
          collectorCapsule.visible = false;
          scanBeam.visible = false;

          // Paused, cautious posture with one hand raised
          leftHand.position.set(-0.35, 0.15, 0.3);
          rightHand.position.set(0.42, -0.18, 0.15);

          headGroup.rotation.z = -0.12;
          headGroup.rotation.x = -0.05;

          // Pulsing cautionary crimson/coral eye alert
          const pulse = (Math.sin(elapsed * 6) + 1) * 0.5;
          eyeGlowMat.color.setRGB(0.95, 0.25 + pulse * 0.2, 0.25);
          amberCoreMat.emissive.setHex(0xef4444);
          amberCoreMat.emissiveIntensity = 0.7 + pulse * 0.3;

          leftEye.scale.set(1.1, 1.1, 1);
          rightEye.scale.set(1.1, 1.1, 1);
          break;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [sizePixels.w, sizePixels.h]);

  const handleCharacterClick = () => {
    setInteractivePulse(true);
    setTimeout(() => setInteractivePulse(false), 1200);
    if (onClick) onClick();
  };

  const getStatusText = (): string => {
    if (statusLabel) return statusLabel;
    switch (action) {
      case 'idle':
        return 'DOCU-BOT // STANDBY';
      case 'upload':
      case 'file_detected':
      case 'receiving':
        return 'DOCUMENT // DETECTED';
      case 'scanning':
      case 'scanning_beam':
      case 'worker_reading':
        return 'OPTICAL SCAN // ACTIVE';
      case 'analyzing':
      case 'worker_analyzing':
      case 'inspecting':
        return 'ANALYSIS // EVALUATING';
      case 'cleaning':
      case 'worker_cleaning':
      case 'worker_normalizing':
      case 'worker_reconstructing':
        return 'RESTORATION // REPAIRING';
      case 'before_after':
      case 'comparing':
        return 'VERIFY // COMPARING';
      case 'success':
      case 'complete':
      case 'celebrating':
        return 'RESTORED // 100% OK';
      case 'download':
      case 'downloading':
        return 'EXPORT // PACKAGING';
      case 'error':
      case 'warning':
        return 'ALERT // INSPECT FILE';
      default:
        return 'DOCU-BOT // ONLINE';
    }
  };

  const getBadgeColor = (): string => {
    switch (action) {
      case 'cleaning':
      case 'worker_cleaning':
        return 'text-[#C65D45] border-[#C65D45]/30 bg-[#FFF8ED]';
      case 'scanning':
      case 'scanning_beam':
        return 'text-[#3C8D87] border-[#3C8D87]/30 bg-[#FFF8ED]';
      case 'analyzing':
        return 'text-[#6B315E] border-[#6B315E]/30 bg-[#FFF8ED]';
      case 'success':
      case 'celebrating':
        return 'text-[#24162F] border-[#3C8D87]/40 bg-[#A8D5C2]/35';
      case 'download':
        return 'text-[#D9A441] border-[#D9A441]/40 bg-[#FFF8ED]';
      case 'error':
      case 'warning':
        return 'text-[#C65D45] border-[#C65D45]/50 bg-[#E98268]/20';
      default:
        return 'text-[#3C8D87] border-[#6B315E]/20 bg-[#FFF8ED]/90';
    }
  };

  return (
    <div
      onClick={handleCharacterClick}
      className={`relative flex flex-col items-center justify-center select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        style={{ width: sizePixels.w, height: sizePixels.h }}
        className="relative"
      />

      {/* Interactive Click Ripple Feedback */}
      {interactivePulse && (
        <span className="absolute inset-0 rounded-full border-2 border-[#3C8D87] animate-ping pointer-events-none" />
      )}

      {/* Character Name / Status Badge in JetBrains Mono */}
      {showStatusBadge && (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold shadow-xs backdrop-blur-md transition-colors ${getBadgeColor()}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              action === 'cleaning' || action === 'scanning'
                ? 'bg-[#C65D45] animate-ping'
                : action === 'error'
                ? 'bg-[#C65D45] animate-pulse'
                : 'bg-[#3C8D87]'
            }`}
          />
          <span>{getStatusText()}</span>
        </div>
      )}
    </div>
  );
};
