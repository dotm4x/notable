import { createContext, useContext } from 'react';
import type { TreeNode } from './types.js';

export interface TTreeContextValue {
  activeId?: string;
  compact: boolean;
  expanded: Set<string>;
  focusId: string | null;
  setFocusId: (id: string) => void;
  setExpanded: (id: string, open: boolean) => void;
  onNavigate?: (node: TreeNode) => void;
  onCompactBranchClick?: () => void;
  onAction?: (node: TreeNode) => void;
  tabbableId?: string;
}

export const TreeContext = createContext<TTreeContextValue | null>(null);

/** Internal: a surrounding component can own the highlight surface. */
export const TreeHighlightContext = createContext(true);

export function useTreeContext(component: string): TTreeContextValue {
  const context = useContext(TreeContext);

  if (!context) {
    throw new Error(`Tree: ${component} must be used within <Tree>.`);
  }

  return context;
}
