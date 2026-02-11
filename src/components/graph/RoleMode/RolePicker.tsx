'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  ROLE_DEFINITIONS,
  ROLE_CATEGORIES,
  computeRoleStats,
  type RoleCategory,
  type RoleDefinition,
} from '@/lib/roles/role-definitions';
import { ROLE_ICON_MAP } from '@/lib/roles/role-icons';
import { useRoleInsight } from '@/lib/roles/use-role-insight';
import { useGraphStore } from '@/lib/store/graph-store';

const CATEGORY_ORDER: RoleCategory[] = ['strategy', 'creative', 'governance', 'operations', 'growth'];

interface RolePickerProps {
  open: boolean;
  onClose: () => void;
  isRoleMode?: boolean;
}

export default function RolePicker({ open, onClose, isRoleMode = false }: RolePickerProps) {
  const { activateRole } = useRoleInsight();
  const graphData = useGraphStore((s) => s.graphData);
  const totalNodes = graphData.nodes.length || 26; // fallback to known count

  const handleSelectRole = (roleId: string) => {
    activateRole(roleId);
    onClose();
  };

  // Group roles by category
  const grouped = useMemo(() => {
    const map = new Map<RoleCategory, RoleDefinition[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const role of ROLE_DEFINITIONS) {
      map.get(role.category)?.push(role);
    }
    return map;
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={isRoleMode ? undefined : onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="glass-panel rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isRoleMode ? 'Choose the Role Closest to Yours' : 'Choose Your Role'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  See the workflow from your perspective
                </p>
              </div>
              {!isRoleMode && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category sections */}
            <div className="space-y-6">
              {CATEGORY_ORDER.map((cat) => {
                const roles = grouped.get(cat);
                if (!roles || roles.length === 0) return null;
                const catMeta = ROLE_CATEGORIES[cat];
                const CatIcon = ROLE_ICON_MAP[catMeta.iconName];

                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      {CatIcon && <CatIcon className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm font-semibold text-foreground">{catMeta.label}</span>
                      <span className="text-xs text-muted-foreground">&mdash; {catMeta.subtitle}</span>
                    </div>

                    {/* Role tiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {roles.map((role) => (
                        <RoleTile
                          key={role.id}
                          role={role}
                          totalNodes={totalNodes}
                          onSelect={handleSelectRole}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Tile component ---

function RoleTile({
  role,
  totalNodes,
  onSelect,
}: {
  role: RoleDefinition;
  totalNodes: number;
  onSelect: (id: string) => void;
}) {
  const Icon = ROLE_ICON_MAP[role.iconName];
  const stats = computeRoleStats(role, totalNodes);

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => onSelect(role.id)}
      className="group relative p-4 rounded-xl text-left
                 bg-white/5 border border-white/10
                 hover:bg-white/[0.08]
                 transition-colors duration-200"
      style={{ borderLeftWidth: 4, borderLeftColor: role.accentColor }}
    >
      {/* Icon badge + title */}
      <div className="flex items-start gap-3 mb-2">
        {Icon && (
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: role.accentColor + '20' }}
          >
            <Icon className="w-4 h-4" style={{ color: role.accentColor }} />
          </div>
        )}
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold text-foreground transition-colors duration-200"
            style={{ color: undefined }}
          >
            <span className="group-hover:hidden">{role.title}</span>
            <span className="hidden group-hover:inline" style={{ color: role.accentColor }}>
              {role.title}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {role.tagline}
          </p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {stats.steps > 0 && (
          <span
            className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#5B9ECF18', color: '#5B9ECF' }}
          >
            {stats.steps} step{stats.steps !== 1 ? 's' : ''}
          </span>
        )}
        {stats.gates > 0 && (
          <span
            className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#D4856A18', color: '#D4856A' }}
          >
            {stats.gates} gate{stats.gates !== 1 ? 's' : ''}
          </span>
        )}
        <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
          {stats.coveragePct}%
        </span>
      </div>
    </motion.button>
  );
}
