import { createContext, useContext } from 'react';
import type { ControlGroupOrientation } from './types.js';

export const ControlGroupOrientationContext =
  createContext<ControlGroupOrientation | null>(null);

export function useControlGroupOrientation() {
  return useContext(ControlGroupOrientationContext);
}
