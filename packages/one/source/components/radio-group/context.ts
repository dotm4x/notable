import { createContext, useContext } from 'react';

export type TRadioGroupContextValue = {
  name: string;
  selectedValue: string | undefined;
  disabled: boolean;
  required: boolean;
  onSelect: (value: string) => void;
};

export const RadioGroupContext = createContext<TRadioGroupContextValue | null>(
  null,
);

export function useRadioGroupContext(componentName: string) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside a RadioGroup.`);
  }

  return context;
}
