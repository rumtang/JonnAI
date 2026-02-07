'use client';

import { useGraphStore } from '@/lib/store/graph-store';
import { navigateToNode } from '@/lib/utils/camera-navigation';
import { NODE_STYLES } from '@/lib/graph/node-styles';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationBreadcrumb() {
  const {
    navigationHistory,
    navigateBack,
    navigateToBreadcrumb,
    selectNode,
    flashLink,
  } = useGraphStore();

  if (navigationHistory.length < 2) return null;

  const handleBack = () => {
    const previousNode = navigateBack();
    if (previousNode) {
      selectNode(previousNode);
      navigateToNode(previousNode, { duration: 800 });
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    // Don't navigate to the current (last) item
    if (index === navigationHistory.length - 1) return;

    const fromNode = navigationHistory[navigationHistory.length - 1];
    const targetNode = navigateToBreadcrumb(index);
    if (targetNode) {
      selectNode(targetNode);
      navigateToNode(targetNode, { duration: 800 });
      flashLink(fromNode.id, targetNode.id);
    }
  };

  // Show "..." if we have more than 5 items, then show last 5
  const MAX_VISIBLE = 5;
  const showEllipsis = navigationHistory.length > MAX_VISIBLE;
  const visibleItems = showEllipsis
    ? navigationHistory.slice(-MAX_VISIBLE)
    : navigationHistory;
  const startIndex = showEllipsis ? navigationHistory.length - MAX_VISIBLE : 0;

  return (
    <div className="flex items-center gap-1 mb-3 px-1">
      <button
        onClick={handleBack}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                   text-muted-foreground hover:text-foreground hover:bg-accent/20
                   transition-colors shrink-0"
        title="Go back"
      >
        <ChevronLeft className="w-3 h-3" />
        Back
      </button>

      <div className="flex items-center gap-0.5 overflow-hidden min-w-0">
        {showEllipsis && (
          <>
            <span className="text-xs text-muted-foreground/50 px-1">...</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
          </>
        )}

        {visibleItems.map((node, i) => {
          const actualIndex = startIndex + i;
          const isLast = actualIndex === navigationHistory.length - 1;
          const style = NODE_STYLES[node.type];

          return (
            <div key={`${node.id}-${actualIndex}`} className="flex items-center gap-0.5 min-w-0">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(actualIndex)}
                disabled={isLast}
                className={`text-xs truncate max-w-[80px] px-1.5 py-0.5 rounded transition-colors ${
                  isLast
                    ? 'font-semibold text-foreground cursor-default'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/20 cursor-pointer'
                }`}
                title={node.label}
                style={isLast ? { color: style?.color } : undefined}
              >
                {node.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
