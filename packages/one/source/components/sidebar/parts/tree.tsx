import { forwardRef } from 'react';
import { TreeHighlightContext } from '../../tree/context.js';
import { Tree } from '../../tree/tree.js';
import { useSidebarContext } from '../context.js';
import type { TSidebarTreeProps } from '../types.js';

/** A navigation tree that inherits the sidebar's collapsed and mobile state. */
export const SidebarTree = forwardRef<HTMLUListElement, TSidebarTreeProps>(
  function SidebarTree({ onNavigate, ...props }, ref) {
    const { isMobile, open, setMobileOpen, setOpen } =
      useSidebarContext('Sidebar.Tree');
    const compact = !open && !isMobile;

    return (
      <TreeHighlightContext.Provider value={false}>
        <Tree
          {...props}
          ref={ref}
          compact={compact}
          onCompactBranchClick={() => setOpen(true)}
          onNavigate={(node) => {
            if (isMobile) {
              setMobileOpen(false);
            }

            onNavigate?.(node);
          }}
        />
      </TreeHighlightContext.Provider>
    );
  },
);
