import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyRoot,
  EmptyTitle,
} from './parts/sections.js';
import type { TEmptyRootProps } from './types.js';
import './empty.css';

export type {
  TEmptyContentProps,
  TEmptyDescriptionProps,
  TEmptyHeaderProps,
  TEmptyMediaProps,
  TEmptyMediaVariant,
  TEmptyRootProps,
  TEmptySize,
  TEmptyTitleProps,
  TEmptyVariant,
} from './types.js';

export interface EmptyComponent extends ForwardRefExoticComponent<
  TEmptyRootProps & RefAttributes<HTMLDivElement>
> {
  /** Renders the region that groups media, title, and description. */
  Header: typeof EmptyHeader;
  /**
   * Renders the visual anchor of an empty state, such as an icon or
   * illustration.
   */
  Media: typeof EmptyMedia;
  /** Renders the title of an empty state. Defaults to an `h3` heading. */
  Title: typeof EmptyTitle;
  /** Renders the muted description of an empty state. */
  Description: typeof EmptyDescription;
  /** Renders the actions and supplementary content of an empty state. */
  Content: typeof EmptyContent;
}

/**
 * Renders a placeholder for a region without content. Compose it with
 * `Empty.Header`, `Empty.Media`, `Empty.Title`, `Empty.Description`, and
 * `Empty.Content`.
 */
export const Empty: EmptyComponent = Object.assign(EmptyRoot, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});
