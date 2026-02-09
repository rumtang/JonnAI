'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2,
  RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { getGraphRef } from '@/lib/graph/graph-ref';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';

const ZOOM_FACTOR = 0.5;
const FIT_ALL_DISTANCE = 500;
const ORBIT_ANGLE = Math.PI / 12; // 15 degrees per click

export default function ZoomControls() {
  const isMobile = useIsMobile();
  // Track held-down buttons for continuous orbit
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const zoom = useCallback((direction: 'in' | 'out') => {
    const fg = getGraphRef();
    if (!fg) return;

    const camera = fg.camera();
    const { x, y, z } = camera.position;
    const scale = direction === 'in' ? 1 - ZOOM_FACTOR : 1 + ZOOM_FACTOR;

    fg.cameraPosition(
      { x: x * scale, y: y * scale, z: z * scale },
      undefined,
      400,
    );
  }, []);

  const fitAll = useCallback(() => {
    const fg = getGraphRef();
    if (!fg) return;

    fg.cameraPosition(
      { x: 0, y: 0, z: FIT_ALL_DISTANCE },
      { x: 0, y: 0, z: 0 },
      800,
    );
  }, []);

  // Orbit the camera around the scene center
  const orbit = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const fg = getGraphRef();
    if (!fg) return;

    const camera = fg.camera();
    const { x, y, z } = camera.position;

    // Convert to spherical coordinates
    const r = Math.sqrt(x * x + y * y + z * z);
    let theta = Math.atan2(x, z);   // horizontal angle
    let phi = Math.acos(y / r);     // vertical angle

    const angle = ORBIT_ANGLE;

    switch (direction) {
      case 'left':  theta -= angle; break;
      case 'right': theta += angle; break;
      case 'up':    phi = Math.max(0.1, phi - angle); break;
      case 'down':  phi = Math.min(Math.PI - 0.1, phi + angle); break;
    }

    // Convert back to cartesian
    const newPos = {
      x: r * Math.sin(phi) * Math.sin(theta),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.cos(theta),
    };

    fg.cameraPosition(newPos, { x: 0, y: 0, z: 0 }, 300);
  }, []);

  // Start continuous orbit on pointer down, stop on pointer up
  const startHold = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    orbit(direction); // fire immediately
    holdIntervalRef.current = setInterval(() => orbit(direction), 200);
  }, [orbit]);

  const stopHold = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => { if (holdIntervalRef.current) clearInterval(holdIntervalRef.current); };
  }, []);

  // Keyboard shortcuts for orbit (arrow keys when graph is focused)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond to arrow keys when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); orbit('left'); break;
        case 'ArrowRight': e.preventDefault(); orbit('right'); break;
        case 'ArrowUp':    e.preventDefault(); orbit('up'); break;
        case 'ArrowDown':  e.preventDefault(); orbit('down'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orbit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-2"
    >
      {/* Orbit D-pad — hidden on mobile (pinch-to-zoom / drag works natively) */}
      {!isMobile && (
        <div className="relative w-[100px] h-[100px]">
          {/* Up */}
          <OrbitButton
            direction="up"
            className="absolute top-0 left-1/2 -translate-x-1/2"
            onStart={() => startHold('up')}
            onStop={stopHold}
            label="Orbit up"
          >
            <ChevronUp className="w-4 h-4" />
          </OrbitButton>

          {/* Left */}
          <OrbitButton
            direction="left"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            onStart={() => startHold('left')}
            onStop={stopHold}
            label="Orbit left"
          >
            <ChevronLeft className="w-4 h-4" />
          </OrbitButton>

          {/* Center — reset */}
          <button
            onClick={fitAll}
            title="Reset view"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       p-2 rounded-full glass-panel text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Right */}
          <OrbitButton
            direction="right"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onStart={() => startHold('right')}
            onStop={stopHold}
            label="Orbit right"
          >
            <ChevronRight className="w-4 h-4" />
          </OrbitButton>

          {/* Down */}
          <OrbitButton
            direction="down"
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            onStart={() => startHold('down')}
            onStop={stopHold}
            label="Orbit down"
          >
            <ChevronDown className="w-4 h-4" />
          </OrbitButton>
        </div>
      )}

      {/* Zoom buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => zoom('in')}
          title="Zoom in"
          className="p-2.5 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => zoom('out')}
          title="Zoom out"
          className="p-2.5 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={fitAll}
          title="Fit all"
          className="p-2.5 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hint — desktop only */}
      {!isMobile && (
        <p className="text-[10px] text-muted-foreground/40 text-center">
          Arrow keys to orbit
        </p>
      )}
    </motion.div>
  );
}

// Hold-to-repeat orbit button
function OrbitButton({
  children,
  className,
  onStart,
  onStop,
  label,
}: {
  children: React.ReactNode;
  direction: string;
  className?: string;
  onStart: () => void;
  onStop: () => void;
  label: string;
}) {
  return (
    <button
      onPointerDown={onStart}
      onPointerUp={onStop}
      onPointerLeave={onStop}
      title={label}
      className={`p-2 rounded-xl glass-panel text-muted-foreground hover:text-foreground
                  transition-all active:scale-90 ${className || ''}`}
    >
      {children}
    </button>
  );
}
