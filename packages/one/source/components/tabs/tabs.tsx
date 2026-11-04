import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { TabsPanelContext } from './context.js';
import { TabsContent } from './parts/content.js';
import { TabsList } from './parts/list.js';
import { TabsTrigger } from './parts/trigger.js';
import type { TabsProps } from './types.js';
import './tabs.css';

export type {
  TabsContentProps,
  TabsListProps,
  TabsOrientation,
  TabsProps,
  TabsTriggerProps,
} from './types.js';

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    className,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    value,
    ...props
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? null,
  );
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const previousValue = useRef(selectedValue);

  // Runs after the panels' own layout effects, which still read the old value.
  useLayoutEffect(() => {
    previousValue.current = selectedValue;
  }, [selectedValue]);

  return (
    <TabsPanelContext.Provider
      value={{ orientation, previousValue, value: selectedValue }}
    >
      <BaseTabs.Root
        {...props}
        ref={ref}
        className={['one-tabs', className].filter(Boolean).join(' ')}
        orientation={orientation}
        data-orientation={orientation}
        defaultValue={defaultValue}
        value={value}
        onValueChange={(nextValue) => {
          setUncontrolledValue(nextValue);
          onValueChange?.(nextValue);
        }}
      />
    </TabsPanelContext.Provider>
  );
});

/**
 * Compound tabs with automatic keyboard activation. Inactive content panels
 * remain mounted but hidden, preserving their state between tab changes.
 */
export interface TabsComponent extends ForwardRefExoticComponent<
  TabsProps & RefAttributes<HTMLDivElement>
> {
  /** Renders the list of tab triggers. */
  List: typeof TabsList;
  /** Renders a button that activates its corresponding tab panel. */
  Trigger: typeof TabsTrigger;
  /** Renders the content panel associated with a tab. */
  Content: typeof TabsContent;
}

export const Tabs: TabsComponent = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
