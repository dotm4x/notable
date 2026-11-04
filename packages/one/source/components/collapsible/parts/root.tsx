import { forwardRef } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { CollapsibleProps } from '../types.js';

export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(
  function CollapsibleRoot(
    { className, open, defaultOpen, onOpenChange, disabled = false, ...props },
    ref,
  ) {
    const classes = ['one-collapsible', className].filter(Boolean).join(' ');

    return (
      <BaseCollapsible.Root
        {...props}
        ref={ref}
        className={classes}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
        disabled={disabled}
      />
    );
  },
);
