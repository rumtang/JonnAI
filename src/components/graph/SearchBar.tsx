'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { GraphNode } from '@/lib/graph/types';
import { Search, X } from 'lucide-react';
import debounce from 'lodash-es/debounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { graphData, setSearchQuery, selectNode, setHighlightedNodeIds } = useGraphStore();
  const { setDetailPanelOpen } = useUIStore();

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    [setSearchQuery]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return graphData.nodes
      .filter(n => n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, graphData.nodes]);

  const handleSelect = useCallback((node: GraphNode) => {
    selectNode(node);
    setDetailPanelOpen(true);
    setHighlightedNodeIds(new Set([node.id]));
    setQuery('');
    setIsOpen(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-80"
    >
      <div className="relative">
        <div className="flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search nodes... (\u2318K)"
            className="bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none w-full"
          />
          {query && (
            <button onClick={handleClear} className="text-slate-500 hover:text-white ml-2">
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
              className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              {results.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: NODE_STYLES[node.type]?.color + '20' }}
                  >
                    {NODE_STYLES[node.type]?.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 truncate">{node.label}</p>
                    <p className="text-xs text-slate-500 truncate">{node.type.replace(/-/g, ' ')}</p>
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
