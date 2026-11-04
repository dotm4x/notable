import { createContext, useContext, type RefObject } from 'react';

export type TDialogContextValue = {
  closeOnBackdropClickRef: RefObject<boolean>;
};

export const DialogContext = createContext<TDialogContextValue | null>(null);

export function useDialogContext(componentName: string) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Dialog.`);
  }

  return context;
}
