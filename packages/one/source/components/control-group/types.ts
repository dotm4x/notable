import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import type {
  SeparatorOrientation,
  SeparatorProps,
} from '../separator/separator.js';

/** Layout direction of the group. */
export type ControlGroupOrientation = 'horizontal' | 'vertical';

/** Props for the ControlGroup root. */
export type ControlGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  /** Layout direction. Defaults to `horizontal`. */
  orientation?: ControlGroupOrientation;
};

/** Props for the ControlGroup separator. */
export type ControlGroupSeparatorProps = Omit<SeparatorProps, 'orientation'> & {
  /** Line direction. Defaults to the axis perpendicular to the group. */
  orientation?: SeparatorOrientation;
};

/** Props for the ControlGroup text part. */
export type ControlGroupTextProps = HTMLAttributes<HTMLSpanElement> & {
  /** Element to render instead of the default `span`. */
  render?: ReactElement<{
    className?: string;
    children?: ReactNode;
  }>;
};
