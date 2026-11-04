import { forwardRef } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { CollapsibleContentProps } from '../types.js';

export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(function CollapsibleContent({ className, children, ...props }, ref) {
  const classes = ['one-collapsible__content-inner', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseCollapsible.Panel className="one-collapsible__content" keepMounted>
      <div {...props} ref={ref} className={classes}>
        {children}
      </div>
    </BaseCollapsible.Panel>
  );
});
