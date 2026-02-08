'use client';

import { Users } from 'lucide-react';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';

interface RoleSelectorButtonProps {
  onOpenPicker: () => void;
}

export default function RoleSelectorButton({ onOpenPicker }: RoleSelectorButtonProps) {
  const isActive = useRoleInsightStore(s => s.isActive);
  const selectedRole = useRoleInsightStore(s => s.selectedRole);

  return (
    <button
      onClick={onOpenPicker}
      className="px-6 py-3 rounded-2xl glass-panel
                 hover:shadow-lg hover:shadow-[#C9A04E]/10
                 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <Users className={`w-4 h-4 ${isActive ? 'text-[#C9A04E]' : 'text-muted-foreground group-hover:text-[#C9A04E]'} transition-colors`} />
        <div className="text-center">
          {isActive && selectedRole ? (
            <>
              <p className="text-sm font-semibold text-[#C9A04E]">
                {selectedRole.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Change role
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#C9A04E] group-hover:text-[#D4B05E] transition-colors">
                Your Role
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                See the workflow from your perspective
              </p>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
