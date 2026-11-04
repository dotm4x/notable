import { AccordionRoot } from './parts/root.js';
import { AccordionItem } from './parts/item.js';
import type { AccordionProps } from './types.js';
import './accordion.css';

export type {
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
} from './types.js';

export interface AccordionComponent extends React.FC<AccordionProps> {
  /**
   * Root component that manages the expansion state. Use `type="single"` for
   * a single open item or `type="multiple"` for multiple.
   */
  Root: typeof AccordionRoot;
  /**
   * A single expandable section of an {@link Accordion}.
   */
  Item: typeof AccordionItem;
}

/** Compound accordion: `Accordion` is the root and `Accordion.Item` its items. */
export const Accordion: AccordionComponent = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
});
