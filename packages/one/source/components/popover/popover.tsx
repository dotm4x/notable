import { PopoverClose, PopoverContent } from './parts/content.js';
import { PopoverRoot, PopoverTrigger } from './parts/root.js';
import {
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from './parts/sections.js';
import type { PopoverProps } from './types.js';
import '../../internal/styles/floating-surface.css';
import './popover.css';

export type {
  PopoverAlign,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverProps,
  PopoverSide,
  PopoverTitleProps,
  PopoverTriggerProps,
} from './types.js';

export interface PopoverComponent extends React.FC<PopoverProps> {
  /** Renders the trigger element that opens the popover. */
  Trigger: typeof PopoverTrigger;
  /** Renders the popover popup container and backdrop/positioner. */
  Content: typeof PopoverContent;
  /** Lays out header content at the top of the popover. */
  Header: typeof PopoverHeader;
  /** Renders the popover title. */
  Title: typeof PopoverTitle;
  /** Renders the popover description. */
  Description: typeof PopoverDescription;
  /** Renders a button that closes the popover. */
  Close: typeof PopoverClose;
}

/**
 * Compound non-modal popover built on Base UI. Compose `Popover.Trigger`,
 * `Popover.Content`, `Popover.Header`, `Popover.Title`, `Popover.Description`,
 * and `Popover.Close` inside the root.
 */
export const Popover: PopoverComponent = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});
