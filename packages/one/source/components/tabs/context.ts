import { createContext } from 'react';
import type { TabsOrientation } from './types.js';

export type TTabsPanelContextValue = {
  orientation: TabsOrientation;
  previousValue: { current: string | null };
  value: string | null;
};

export const TabsPanelContext = createContext<TTabsPanelContextValue | null>(
  null,
);

// Value of the tab currently showing the shared animated highlight.
export const TabsHighlightContext = createContext<string | null>(null);
