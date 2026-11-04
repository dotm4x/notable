import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { forwardRef, useContext } from 'react';
import { TabsHighlightContext } from '../context.js';
import type { TabsTriggerProps } from '../types.js';

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger(
    { children, className, type = 'button', ...props },
    ref,
  ) {
    const highlightedValue = useContext(TabsHighlightContext);
    const isHighlighted = !props.disabled && highlightedValue === props.value;

    return (
      <BaseTabs.Tab
        {...props}
        ref={ref}
        type={type}
        data-selector-value={props.value}
        data-highlighted={isHighlighted || undefined}
        data-selector-item
        className={['one-tabs__trigger', className].filter(Boolean).join(' ')}
      >
        <span className="one-tabs__trigger-label">{children}</span>
      </BaseTabs.Tab>
    );
  },
);
