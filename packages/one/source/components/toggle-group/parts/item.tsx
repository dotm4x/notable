import { forwardRef } from 'react';
import { Toggle } from '../../toggle/toggle.js';
import { useToggleGroupStyleContext } from '../context.js';
import type { TToggleGroupItemProps } from '../types.js';

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  TToggleGroupItemProps
>(function ToggleGroupItem({ className, value, ...props }, ref) {
  const styles = useToggleGroupStyleContext('ToggleGroup.Item');

  if (!value) {
    throw new Error('ToggleGroup values must be non-empty strings.');
  }

  return (
    <Toggle
      {...props}
      ref={ref}
      value={value}
      variant={styles.variant}
      size={styles.size}
      className={['one-toggle-group__item', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
});
