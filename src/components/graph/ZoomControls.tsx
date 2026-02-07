'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { getGraphRef } from '@/lib/graph/graph-ref';

const ZOOM_FACTOR = 0.3;
const FIT_ALL_DISTANCE = 350;

export default function ZoomControls() {
  const zoom = useCallback((direction: 'in' | 'out') => {
    const fg = getGraphRef();
    if (!fg) return;

    const camera = fg.camera();
    const { x, y, z } = camera.position;
    // Scale distance from origin by zoom factor
    const scale = direction === 'in' ? 1 - ZOOM_FACTOR : 1 + ZOOM_FACTOR;

    fg.cameraPosition(
      { x: x * scale, y: y * scale, z: z * scale },
      undefined, // keep current lookAt
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

  const buttons = [
    { icon: ZoomIn, label: 'Zoom in', onClick: () => zoom('in') },
    { icon: ZoomOut, label: 'Zoom out', onClick: () => zoom('out') },
    { icon: Maximize2, label: 'Fit all', onClick: fitAll },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-1"
    >
      {buttons.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="p-2.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all hover:bg-white/10"
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </motion.div>
  );
}
