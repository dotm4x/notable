import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  CalloutActions,
  CalloutContent,
  CalloutIcon,
  CalloutRoot,
  CalloutTitle,
} from './parts/sections.js';
import type { TCalloutProps } from './types.js';
import './callout.css';

export type {
  TCalloutActionsProps,
  TCalloutContentProps,
  TCalloutIconProps,
  TCalloutProps,
  TCalloutRole,
  TCalloutTitleProps,
  TCalloutTone,
} from './types.js';

export interface CalloutComponent extends ForwardRefExoticComponent<
  TCalloutProps & RefAttributes<HTMLDivElement>
> {
  /** Renders the decorative icon that introduces the message. */
  Icon: typeof CalloutIcon;
  /** Groups the title and body of the message. */
  Content: typeof CalloutContent;
  /** Renders the message title. Defaults to a paragraph. */
  Title: typeof CalloutTitle;
  /** Holds optional actions such as a link or a dismiss button. */
  Actions: typeof CalloutActions;
}

/**
 * Renders a persistent inline message with a semantic tone. Compose it with
 * `Callout.Icon`, `Callout.Content`, `Callout.Title`, and `Callout.Actions`.
 */
export const Callout: CalloutComponent = Object.assign(CalloutRoot, {
  Actions: CalloutActions,
  Content: CalloutContent,
  Icon: CalloutIcon,
  Title: CalloutTitle,
});
