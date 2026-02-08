'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ROLE_DEFINITIONS } from '@/lib/roles/role-definitions';
import { useRoleInsight } from '@/lib/roles/use-role-insight';

interface RolePickerProps {
  open: boolean;
  onClose: () => void;
}

export default function RolePicker({ open, onClose }: RolePickerProps) {
  const { activateRole } = useRoleInsight();

  const handleSelectRole = (roleId: string) => {
    activateRole(roleId);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="glass-panel rounded-2xl p-8 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Choose Your Role</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  See the workflow from your perspective
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3x3 role grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLE_DEFINITIONS.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className="group p-4 rounded-xl text-left
                             bg-white/5 border border-white/10
                             hover:border-[#C9A04E]/50 hover:bg-[#C9A04E]/5
                             transition-all duration-200"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#C9A04E] transition-colors mb-1">
                    {role.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
