import { createContext, useContext } from 'react';

export type CheckboxGroupContextValue = {
  selectedValues: readonly string[];
  disabled: boolean;
  onToggle: (value: string, checked: boolean) => void;
};

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext() {
  const context = useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error(
      'CheckboxGroup.Item must be rendered inside a CheckboxGroup.',
    );
  }

  return context;
}
