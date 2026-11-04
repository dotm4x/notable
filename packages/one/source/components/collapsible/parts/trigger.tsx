import { forwardRef } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { CollapsibleTriggerProps } from '../types.js';

export const CollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger({ className, type = 'button', ...props }, ref) {
  const classes = ['one-collapsible__trigger', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseCollapsible.Trigger
      {...props}
      ref={ref}
      type={type}
      className={classes}
    />
  );
});
