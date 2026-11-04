import { createContext, useContext } from 'react';
import type { TToggleSize, TToggleVariant } from '../toggle/toggle.js';

export type TToggleGroupStyleContextValue = {
  variant: TToggleVariant;
  size: TToggleSize;
};

export const ToggleGroupStyleContext =
  createContext<TToggleGroupStyleContextValue | null>(null);

export function useToggleGroupStyleContext(componentName: string) {
  const context = useContext(ToggleGroupStyleContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside a ToggleGroup.`);
  }

  return context;
}
