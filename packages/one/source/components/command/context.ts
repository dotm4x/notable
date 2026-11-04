import { createContext, useContext } from 'react';
import type { CommandItem } from './types.js';

export type TCommandContextValue = {
  selectItem: (item: CommandItem) => void;
};

export const CommandContext = createContext<TCommandContextValue | null>(null);

export function useCommandContext(componentName: string): TCommandContextValue {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Command.`);
  }

  return context;
}
