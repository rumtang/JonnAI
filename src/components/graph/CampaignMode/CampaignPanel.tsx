'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCampaignStore } from '@/lib/store/campaign-store';
import CampaignHeader from './CampaignHeader';
import CampaignNodeCard from './CampaignNodeCard';
import CampaignLog from './CampaignLog';

export default function CampaignPanel() {
  const { isActive, currentNodeId } = useCampaignStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever the active node changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentNodeId]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      onWheel={(e) => e.stopPropagation()}
      className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-[420px] z-50
                 glass-panel rounded-l-2xl flex flex-col"
    >
      <div className="flex flex-col h-full p-6 overflow-hidden">
        {/* Fixed header section */}
        <CampaignHeader />

        {/* Divider */}
        <div className="border-t border-border my-3" />

        {/* Scrollable content area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <CampaignNodeCard />
          <CampaignLog />
        </div>
      </div>
    </motion.div>
  );
}
