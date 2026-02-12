'use client';

import { useEffect, useRef, useState } from 'react';

export default function FpsCounter() {
  const [fps, setFps] = useState(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const measure = () => {
      frameRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 500) {
        setFps(Math.round((frameRef.current * 1000) / elapsed));
        frameRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(measure);
    };

    rafRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground/40 select-none">
      {fps} fps
    </div>
  );
}
