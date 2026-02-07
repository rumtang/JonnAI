import { create } from 'zustand';
import { GraphData } from '../graph/types';
import { RoleDefinition, ROLE_MAP } from '../roles/role-definitions';
import { RoleSubgraph, computeRoleSubgraph } from '../roles/role-subgraph';

interface RoleInsightState {
  selectedRoleId: string | null;
  selectedRole: RoleDefinition | null;
  roleSubgraph: RoleSubgraph | null;
  isActive: boolean;

  selectRole: (roleId: string, graphData: GraphData) => void;
  clearRole: () => void;
}

export const useRoleInsightStore = create<RoleInsightState>((set) => ({
  selectedRoleId: null,
  selectedRole: null,
  roleSubgraph: null,
  isActive: false,

  selectRole: (roleId, graphData) => {
    const role = ROLE_MAP.get(roleId);
    if (!role) return;

    const subgraph = computeRoleSubgraph(role, graphData);
    set({
      selectedRoleId: roleId,
      selectedRole: role,
      roleSubgraph: subgraph,
      isActive: true,
    });
  },

  clearRole: () => set({
    selectedRoleId: null,
    selectedRole: null,
    roleSubgraph: null,
    isActive: false,
  }),
}));
