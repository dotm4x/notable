import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

/** Orientation of the tab list. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Props for {@link Tabs}, in addition to native `div` attributes. */
export type TabsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  /** Selected tab value in controlled mode. Pass `null` to select no tab. */
  value?: string | null;
  /** Initial selected tab value in uncontrolled mode. */
  defaultValue?: string | null;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string | null) => void;
  /** Tab list orientation. Defaults to `horizontal`. */
  orientation?: TabsOrientation;
};

/** Props for `Tabs.List`. */
export type TabsListProps = HTMLAttributes<HTMLDivElement>;

/** Props for `Tabs.Trigger`, in addition to native button attributes. */
export type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> & {
  /** Value associated with the corresponding `Tabs.Content`. */
  value: string;
};

/** Props for `Tabs.Content`, in addition to native `div` attributes. */
export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Value associated with the corresponding `Tabs.Trigger`. */
  value: string;
};
