import { createContext, useContext, type RefObject } from 'react';
import type { DrawerSide } from './types.js';

/** One mounted drawer in the stack, used to close it and the drawers in front of it. */
export type TDrawerStackEntry = {
  popupRef: RefObject<HTMLElement | null>;
  close: () => void;
  closeOnBackdropClickRef: RefObject<boolean>;
};

export type TDrawerContextValue = {
  closeOnBackdropClickRef: RefObject<boolean>;
  side: DrawerSide;
  stackEntry: TDrawerStackEntry;
};

export const DrawerContext = createContext<TDrawerContextValue | null>(null);

export function useDrawerContext(componentName: string) {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Drawer.`);
  }

  return context;
}
