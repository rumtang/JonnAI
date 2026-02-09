'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { GraphNode } from '@/lib/graph/types';
import { Search, X } from 'lucide-react';
import debounce from 'lodash-es/debounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { graphData, fullGraphData, setSearchQuery, selectNode, setHighlightedNodeIds, visibleNodeTypes } = useGraphStore();
  const { setDetailPanelOpen } = useUIStore();
  const isMobile = useIsMobile();

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    [setSearchQuery]
  );

  // Search all nodes (including hidden ones in progressive reveal) so users can find anything
  const searchNodes = fullGraphData?.nodes ?? graphData.nodes;
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchNodes
      .filter(n => visibleNodeTypes.has(n.type))
      .filter(n => n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, searchNodes, visibleNodeTypes]);

  const handleSelect = useCallback((node: GraphNode) => {
    // Auto-reveal if progressive reveal is on
    const { progressiveReveal, expandNode } = useGraphStore.getState();
    if (progressiveReveal) expandNode(node.id);
    selectNode(node);
    setDetailPanelOpen(true);
    setHighlightedNodeIds(new Set([node.id]));
    setQuery('');
    setIsOpen(false);
    setMobileExpanded(false);
  }, [selectNode, setDetailPanelOpen, setHighlightedNodeIds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
    if (val.trim()) setIsOpen(true);
    else setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
    setIsOpen(false);
    setMobileExpanded(false);
  };

  // Keyboard shortcut: Cmd+K to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // On mobile: collapsed = icon button, expanded = full-width overlay
  if (isMobile && !mobileExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-4 left-16 z-50"
      >
        <button
          onClick={() => { setMobileExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); }}
          className="p-2.5 rounded-xl glass-panel text-muted-foreground hover:text-foreground transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={
        isMobile
          ? 'fixed top-4 left-4 right-4 z-50'
          : 'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-80'
      }
    >
      <div className="relative">
        <div className="flex items-center glass-panel rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder={isMobile ? 'Search nodes...' : 'Search nodes... (\u2318K)'}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
          {(query || isMobile) && (
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full mt-2 w-full glass-panel rounded-xl overflow-hidden shadow-2xl"
            >
              {results.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent/10 transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: NODE_STYLES[node.type]?.color + '20' }}
                  >
                    {NODE_STYLES[node.type]?.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{node.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{node.type.replace(/-/g, ' ')}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
