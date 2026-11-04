import { CollapsibleRoot } from './parts/root.js';
import { CollapsibleTrigger } from './parts/trigger.js';
import { CollapsibleContent } from './parts/content.js';
import type { CollapsibleProps } from './types.js';
import './collapsible.css';

export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from './types.js';

export interface CollapsibleComponent extends React.ForwardRefExoticComponent<
  CollapsibleProps & React.RefAttributes<HTMLDivElement>
> {
  Root: typeof CollapsibleRoot;
  /** Button that toggles the content of its collapsible section. */
  Trigger: typeof CollapsibleTrigger;
  /** Region revealed by the collapsible trigger. */
  Content: typeof CollapsibleContent;
}

/** Shows and hides a section of content. Compound: `Collapsible.Trigger` toggles `Collapsible.Content`. */
export const Collapsible: CollapsibleComponent = Object.assign(
  CollapsibleRoot,
  {
    Root: CollapsibleRoot,
    Trigger: CollapsibleTrigger,
    Content: CollapsibleContent,
  },
);
