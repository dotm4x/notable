import { DrawerContent } from './parts/content.js';
import { DrawerRoot, DrawerTrigger } from './parts/root.js';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './parts/sections.js';
import type { DrawerProps } from './types.js';
import './drawer.css';

export type {
  DrawerCloseProps,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerTitleProps,
  DrawerTriggerProps,
} from './types.js';

export interface DrawerComponent extends React.FC<DrawerProps> {
  /** Renders the trigger element that opens the drawer. */
  Trigger: typeof DrawerTrigger;
  /** Renders the modal drawer surface and backdrop. */
  Content: typeof DrawerContent;
  /** Lays out header content at the top of the drawer. */
  Header: typeof DrawerHeader;
  /** Renders the drawer title. */
  Title: typeof DrawerTitle;
  /** Renders the drawer description. */
  Description: typeof DrawerDescription;
  /** Lays out footer action buttons at the bottom of the drawer. */
  Footer: typeof DrawerFooter;
  /** Renders a button that closes the drawer. */
  Close: typeof DrawerClose;
}

/**
 * Compound modal drawer built on Base UI. Compose `Drawer.Trigger`,
 * `Drawer.Content`, `Drawer.Header`, `Drawer.Title`, `Drawer.Description`,
 * `Drawer.Footer`, and `Drawer.Close` inside the root.
 */
export const Drawer: DrawerComponent = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Close: DrawerClose,
});
