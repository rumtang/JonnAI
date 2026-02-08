'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, ArrowRight, RefreshCw } from 'lucide-react';
import { useRoleInsightStore } from '@/lib/store/role-insight-store';
import { useGraphStore } from '@/lib/store/graph-store';
import { useUIStore } from '@/lib/store/ui-store';
import { useRoleInsight } from '@/lib/roles/use-role-insight';
import { getTeamConnections, TeamConnection } from '@/lib/roles/role-subgraph';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { GraphNode, NodeType } from '@/lib/graph/types';
import { navigateToNode } from '@/lib/utils/camera-navigation';

interface RoleInsightPanelProps {
  onChangeRole: () => void;
}

export default function RoleInsightPanel({ onChangeRole }: RoleInsightPanelProps) {
  const selectedRole = useRoleInsightStore(s => s.selectedRole);
  const roleSubgraph = useRoleInsightStore(s => s.roleSubgraph);
  const isActive = useRoleInsightStore(s => s.isActive);
  const { deactivateRole, activateRole } = useRoleInsight();
  const graphData = useGraphStore(s => s.graphData);
  const selectNode = useGraphStore(s => s.selectNode);
  const setDetailPanelOpen = useUIStore(s => s.setDetailPanelOpen);

  if (!selectedRole || !roleSubgraph) return null;

  // Split nodes into primary (owned steps + gates) and support (agents + inputs)
  const primaryNodes = graphData.nodes.filter(
    n => roleSubgraph.primaryNodeIds.has(n.id)
  );
  const supportNodes = graphData.nodes.filter(
    n => roleSubgraph.supportNodeIds.has(n.id)
  );

  const teamConnections = getTeamConnections(selectedRole, graphData);

  // When clicking a node in the list: deactivate role, select node, show NodeDetailPanel
  const handleNodeClick = (node: GraphNode) => {
    // Clear role store only (not graph highlights — selectNode will set its own)
    useRoleInsightStore.getState().clearRole();
    selectNode(node);
    setDetailPanelOpen(true);
    navigateToNode(node, { distance: 120, duration: 1000 });
  };

  const handleConnectedRoleClick = (roleId: string) => {
    activateRole(roleId);
  };

  const handleClose = () => {
    deactivateRole();
  };

  const narrative = selectedRole.narrative;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 z-50 glass-panel rounded-l-2xl overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C9A04E]/20">
                  <Users className="w-5 h-5 text-[#C9A04E]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selectedRole.title}</h2>
                  <p className="text-xs text-[#C9A04E] font-medium mt-0.5">{selectedRole.description}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Narrative sections with staggered animation */}
            <div className="space-y-4 mb-6">
              <NarrativeCard
                title="Your Work Today"
                content={narrative.today}
                delay={0.1}
              />
              <NarrativeCard
                title="Your Future with AI"
                content={narrative.future}
                delay={0.2}
              />
              <NarrativeCard
                title="How Your Team Supports You"
                content={narrative.teamSupport}
                delay={0.3}
              />
              {/* Key Insight — gold-bordered callout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-[#C9A04E]/5 border border-[#C9A04E]/30"
              >
                <h4 className="text-xs font-semibold text-[#C9A04E] mb-2">Key Insight</h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{narrative.keyInsight}</p>
              </motion.div>
            </div>

            {/* Your Nodes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Your Nodes</h3>

              {primaryNodes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Owned Steps & Gates</p>
                  <div className="space-y-1">
                    {primaryNodes.map(node => (
                      <NodeRow key={node.id} node={node} onClick={handleNodeClick} />
                    ))}
                  </div>
                </div>
              )}

              {supportNodes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Supporting Agents & Inputs</p>
                  <div className="space-y-1">
                    {supportNodes.map(node => (
                      <NodeRow key={node.id} node={node} onClick={handleNodeClick} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Connected Roles */}
            {teamConnections.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Connected Roles ({teamConnections.length})
                </h3>
                <div className="space-y-1">
                  {teamConnections.map(conn => (
                    <ConnectedRoleRow
                      key={conn.roleId}
                      connection={conn}
                      onClick={handleConnectedRoleClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={onChangeRole}
                className="flex-1 px-4 py-3 rounded-xl bg-[#C9A04E]/20 hover:bg-[#C9A04E]/30
                           border border-[#C9A04E]/30 text-[#C9A04E] font-semibold text-sm
                           transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Change Role
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10
                           border border-white/10 text-muted-foreground font-semibold text-sm
                           transition-all duration-200"
              >
                Clear View
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NarrativeCard({ title, content, delay }: { title: string; content: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/5 border border-white/10"
    >
      <h4 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h4>
      <p className="text-sm text-foreground/90 leading-relaxed">{content}</p>
    </motion.div>
  );
}

function NodeRow({ node, onClick }: { node: GraphNode; onClick: (node: GraphNode) => void }) {
  const style = NODE_STYLES[node.type as NodeType];
  return (
    <button
      onClick={() => onClick(node)}
      className="group w-full flex items-center gap-3 p-2 rounded-lg
                 hover:bg-accent/20 transition-all duration-200 text-left
                 border border-transparent hover:border-white/10"
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-xs"
        style={{ backgroundColor: (style?.color || '#6b7280') + '20' }}
      >
        {style?.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{node.label}</p>
        <p className="text-xs text-muted-foreground">{node.type}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground
                             transition-all duration-200 shrink-0" />
    </button>
  );
}

function ConnectedRoleRow({ connection, onClick }: { connection: TeamConnection; onClick: (roleId: string) => void }) {
  return (
    <button
      onClick={() => onClick(connection.roleId)}
      className="group w-full flex items-center gap-3 p-2 rounded-lg
                 hover:bg-accent/20 transition-all duration-200 text-left
                 border border-transparent hover:border-[#C9A04E]/20"
    >
      <div className="w-6 h-6 rounded flex items-center justify-center bg-[#C9A04E]/10">
        <Users className="w-3.5 h-3.5 text-[#C9A04E]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{connection.roleTitle}</p>
        {connection.sharedNodeIds.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {connection.sharedNodeIds.length} shared node{connection.sharedNodeIds.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground
                             transition-all duration-200 shrink-0" />
    </button>
  );
}
