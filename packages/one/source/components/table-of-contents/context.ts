import { createContext, useContext } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { TableOfContentsSide } from './types.js';

export type TTableOfContentsContextValue = {
  activeId: string | null;
  handleLinkClick: (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => void;
  prefersReducedMotion: boolean;
  side: TableOfContentsSide;
};

export const TableOfContentsContext =
  createContext<TTableOfContentsContextValue | null>(null);

export function useTableOfContentsContext() {
  const context = useContext(TableOfContentsContext);
  if (!context) {
    throw new Error(
      'TableOfContents.Item must be rendered inside TableOfContents.Root.',
    );
  }
  return context;
}
